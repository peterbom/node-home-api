import {Log} from "../shared/log";
import path from "path";

export class PhotoIndexServices {
    constructor (exifTool, imageDataAccess, fileFinder, photoBaseDirectories) {
        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    async compare() {
        let files = await this._fileFinder.findFiles(
            this._photoBaseDirectories,
            [/(?!.*\/)?@.*/, /.*\.db/],
            /^(?!.*\.db$)/);

        let directoryFilesLookup = {};
        files.forEach(file => {
            let files = directoryFilesLookup[file.directoryPath];

            if (!files) {
                files = [];
                directoryFilesLookup[file.directoryPath] = files;
            }

            files.push(file.filename);
        });

        let directories = [];

        let diffPromises = [];
        for (let directoryPath in directoryFilesLookup) {
            let files = directoryFilesLookup[directoryPath];

            let directory = {
                directoryPath: directoryPath,
                fileCount: files.length,
                newFileCount: 0,
                deletedFileCount: 0
            };

            directories.push(directory);

            let directoryDiff = async () => {
                let diff = await this._imageDataAccess.getDiff(directoryPath, files);
                directory.newFileCount = diff.new.length;
                directory.deletedFileCount = diff.deleted.length;
            };

            diffPromises.push(directoryDiff());
        }

        let indexedDirectories = await this._imageDataAccess.getIndexedDirectories();
        for (let indexedDirectory of indexedDirectories) {
            if (!directories.some(d => d.directoryPath.toLowerCase() === indexedDirectory.directoryPath)) {
                directories.push({
                    directoryPath: indexedDirectory.directoryPath,
                    newFileCount: 0,
                    deletedFileCount: indexedDirectory.imageCount
                });
            }
        }

        // Wait for any remaining diff promises to complete
        await Promise.all(diffPromises);

        return directories;
    }

    async invalidatePath (directoryPath) {
        await this._imageDataAccess.invalidateImages(directoryPath);
    }

    async invalidateImageIds(ids) {
        await this._imageDataAccess.invalidateImageIds(ids);
    }

    async indexPath (directoryPath, maxIndexCount) {
        let indexedImages = await this._imageDataAccess.getByPath(directoryPath);

        let indexedFilenameLookup = {};
        indexedImages.forEach(img => indexedFilenameLookup[img.filename] = true);

        // Get all the files on disk
        let filenames = await this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);
        filenames = filenames.filter(f => {
            // Exclude those which are already indexed
            return !indexedFilenameLookup[f.toLowerCase()];
        });

        // Only attempt the first maxIndexCount to keep time down
        let batch = filenames.splice(0, maxIndexCount);

        let imageInfos = batch.map(f => ({
            directoryPath: directoryPath,
            filename: f
        }));

        await setPropertiesForImageInfos(this._exifTool, imageInfos);

        let imagePromises = imageInfos.map(i =>
            this._imageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties));

        await Promise.all(imagePromises);

        return {
            indexed: batch.length,
            remaining: filenames.length
        };
    }

    async indexImageIds (ids) {
        let images = await this._imageDataAccess.getByIds(ids);

        let imageInfos = images.map(i => ({
            directoryPath: i.directoryPath,
            filename: i.filename
        }));

        await setPropertiesForImageInfos(this._exifTool, imageInfos);

        let imagePromises = imageInfos.map(i =>
            this._imageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties));

        await Promise.all(imagePromises);
    }

    async cleanPath (directoryPath) {
        // Get all the files on disk
        let filenames = await this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);
        await this._imageDataAccess.cleanExcept(directoryPath, filenames);
    }

    async cleanImageIds (ids) {
        await this._imageDataAccess.cleanIds(ids);
    }
}

async function setPropertiesForImageInfos(exifTool, imageInfos) {
    let filePaths = [];
    let imageInfoLookup = {};
    imageInfos.forEach(i => {
        let filePath = path.join(i.directoryPath, i.filename);
        filePaths.push(filePath);
        imageInfoLookup[filePath] = {
            directoryPath: i.directoryPath,
            filename: i.filename
        }
    });

    // Attempt to read all files first
    let allFilesPropertyLookup = await exifTool.getProperties(...filePaths);
    if (!allFilesPropertyLookup) {
        // Reading all files failed. Attempt them one-by-one
        allFilesPropertyLookup = {};
        for (let filePath of filePaths) {
            let filePropertyLookup = await exifTool.getProperties(filePath);
            allFilesPropertyLookup[filePath] = filePropertyLookup ? filePropertyLookup[filePath] : null;
        }
    }

    for (let filePath in allFilesPropertyLookup) {
        let imageInfo = imageInfoLookup[filePath];
        imageInfo.properties = allFilesPropertyLookup[filePath];  // Can be null for unreadable files
    }
}
