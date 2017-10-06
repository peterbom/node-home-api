const Log = require("../shared/log").Log;
const path = require("path");

class PhotoDuplicateServices {
    constructor (exifTool, photoImageDataAccess) {
        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
    }

    async listDuplicates() {
        return await this._photoImageDataAccess.listDuplicates();
    }

    async getDuplicates(hash) {
        let images = await this._photoImageDataAccess.getByHash(hash);
        return images.map(image => ({
            id: image._id,
            directoryPath: image.directoryPath,
            filename: image.filename,
            properties: image.properties
        }));
    }

    async resolveDuplicates(sameIds, differentIds) {
        if (sameIds.length > 1) {
            await this._photoImageDataAccess.combineDuplicateHistories(sameIds);
        }

        let differentImages = await this._photoImageDataAccess.getByIds(differentIds);
        let imageNumber = 1;
        let directoryPathLookup = {};
        for (let image of differentImages) {
            directoryPathLookup[image.directoryPath] = true;
            let filePath = path.join(image.directoryPath, image.filename);
            await this._exifTool.setIntegerProperty(filePath, "ImageNumber", imageNumber++);
        }

        await this._photoImageDataAccess.invalidateImageIds(differentIds);
    }
}

exports.PhotoDuplicateServices = PhotoDuplicateServices;