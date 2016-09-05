import {Log} from "../shared/log";
import path from "path";

export class PhotoSyncServices {
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

    async invalidate (directoryPath) {
        await this._imageDataAccess.invalidateImages(directoryPath);
    }

    async index (directoryPath, maxIndexCount) {
        let indexedFilenames = await this._imageDataAccess.getImageFilenames(directoryPath);

        let indexedFilenameLookup = {};
        indexedFilenames.forEach(f => indexedFilenameLookup[f] = true);

        // Get all the files on disk
        let filenames = await this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);
        filenames = filenames.filter(f => {
            // Exclude those which are already indexed
            return !indexedFilenameLookup[f.toLowerCase()];
        });

        // Only attempt the first maxIndexCount to keep time down
        let batch = filenames.splice(0, maxIndexCount);

        let filePropertyLookup = await getFilePropertyLookup(this._exifTool, directoryPath, batch);
        let imagePromises = [];
        for (let filename in filePropertyLookup) {
            let properties =  filePropertyLookup[filename];  // Can be null for unreadable files
            imagePromises.push(this._imageDataAccess.upsertImage(directoryPath, filename, properties));
        }

        await Promise.all(imagePromises);

        return {
            indexed: batch.length,
            remaining: filenames.length
        };
    }

    async clean (directoryPath) {
        // Get all the files on disk
        let filenames = await this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);
        await this._imageDataAccess.cleanExcept(directoryPath, filenames);
    }
}

async function getFilePropertyLookup(exifTool, directoryPath, filenames) {
    if (!filenames.length) {
        return {};
    }

    let filePaths = filenames.map(f => path.join(directoryPath, f));

    // Attempt to read all files first
    let filePropertyLookup = await exifTool.getProperties(...filePaths);
    if (filePropertyLookup) {
        return filePropertyLookup;
    }

    // Reading all files failed. Attempt them one-by-one
    let results = {};
    for (let filename of filenames) {
        let filePath = path.join(directoryPath, filename);
        filePropertyLookup = await exifTool.getProperties(filePath);
        results[filename] = filePropertyLookup ? filePropertyLookup[filename] : null;
    }

    return results;
}
