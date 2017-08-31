const Log = require("../shared/log").Log;
const path = require("path");

class PhotoIndexServices {
    constructor (exifTool, photoImageDataAccess, fileServices, photoBaseDirectories) {
        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
        this._fileServices = fileServices;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    async listDirectories () {
        let indexedDirectories = await this._photoImageDataAccess.getIndexedDirectories();
        let fileDirectories = await this._fileServices.findDirectories(
            this._photoBaseDirectories,
            /(?!.*\/)?@.*/,
            /.*\.db/);

        // concat and remove duplicates
        let set = new Set(indexedDirectories.concat(fileDirectories));
        return Array.from(set).sort();
    }

    async compare(directoryPath) {
        let files = await this._fileServices.getFiles(
            directoryPath,
            /^(?!.*\.db$)/);

        let diff = await this._photoImageDataAccess.getDiff(directoryPath, files);

        return {
            directoryPath: directoryPath,
            fileCount: files.length,
            newFileCount: diff.new.length,
            deletedFileCount: diff.deleted.length
        };
    }

    async invalidatePath (directoryPath) {
        await this._photoImageDataAccess.invalidateImages(directoryPath);
    }

    async invalidateImageIds(ids) {
        await this._photoImageDataAccess.invalidateImageIds(ids);
    }

    async indexPath (directoryPath, maxIndexCount) {
        let indexedImages = await this._photoImageDataAccess.getByPath(directoryPath);

        let indexedFilenameLookup = {};
        indexedImages.forEach(img => indexedFilenameLookup[img.filename] = true);

        // Get all the files on disk
        let filenames = await this._fileServices.getFiles(directoryPath, /^(?!.*\.db$)/);
        filenames = filenames.filter(f => {
            // Exclude those which are already indexed
            return !indexedFilenameLookup[f];
        });

        // Only attempt the first maxIndexCount to keep time down
        let batch = filenames.splice(0, maxIndexCount);

        let imageInfos = batch.map(f => ({
            directoryPath: directoryPath,
            filename: f
        }));

        await setPropertiesForImageInfos(this._exifTool, imageInfos);

        let imagePromises = imageInfos.map(i =>
            this._photoImageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties));

        await Promise.all(imagePromises);

        return {
            indexed: batch.length,
            remaining: filenames.length
        };
    }

    async indexImageIds (ids) {
        // Pass 'true' to include invalidated images (the whole point of invalidating
        // them is to cause them to be re-indexed, so we really do want invalid ones too).
        let images = await this._photoImageDataAccess.getByIds(ids, true);

        let imageInfos = images.map(i => ({
            directoryPath: i.directoryPath,
            filename: i.filename
        }));

        await setPropertiesForImageInfos(this._exifTool, imageInfos);

        let imagePromises = imageInfos.map(i =>
            this._photoImageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties));

        await Promise.all(imagePromises);
    }

    async cleanPath (directoryPath) {
        // Get all the files on disk
        let filenames = await this._fileServices.getFiles(directoryPath, /^(?!.*\.db$)/);
        await this._photoImageDataAccess.cleanExcept(directoryPath, filenames);
    }

    async cleanImageIds (ids) {
        await this._photoImageDataAccess.cleanIds(ids);
    }
}

async function setPropertiesForImageInfos(exifTool, imageInfos) {
    let filePaths = [];
    let imageInfoLookup = {};
    imageInfos.forEach(imageInfo => {
        let filePath = path.join(imageInfo.directoryPath, imageInfo.filename);
        filePaths.push(filePath);
        imageInfoLookup[filePath] = imageInfo;
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
        let properties = allFilesPropertyLookup[filePath];  // Can be null for unreadable files
        imageInfo.properties = properties;
    }
}

exports.PhotoIndexServices = PhotoIndexServices;