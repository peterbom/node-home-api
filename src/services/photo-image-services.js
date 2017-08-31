const Log = require("../shared/log").Log;

class PhotoImageServices {
    constructor (photoImageDataAccess) {
        this._photoImageDataAccess = photoImageDataAccess;
    }

    async getById (id) {
        let image = await this._photoImageDataAccess.getById(id);
        if (!image) {
            return null;
        }

        return toReturn([image])[0];
    }

    async findUnreadable () {
        let images = await this._photoImageDataAccess.findUnreadable();
        return toReturn(images);
    }

    async findMissingTakenDate () {
        let images = await this._photoImageDataAccess.findMissingTakenDate();
        return toReturn(images);
    }

    async findByCriteria (criteria) {
        let images = await this._photoImageDataAccess.findByCriteria(criteria);
        return toReturn(images);
    }

    async getSummaryCounts() {
        let [
            totalCount,
            readableCount,
            requiringMovementCount
        ] = await Promise.all([
            this._photoImageDataAccess.getTotalCount(),
            this._photoImageDataAccess.getReadableCount(),
            this._photoImageDataAccess.getRequiringMovementCount()
        ]);

        return {
            totalCount: totalCount,
            readableCount: readableCount,
            requiringMovementCount: requiringMovementCount
        };
    }

    async getYearlyTotals() {
        return await this._photoImageDataAccess.getYearlySummary();
    }
}

function toReturn(images) {
    return images.map(image => ({
        id: image._id,
        directoryPath: image.directoryPath,
        filename: image.filename,
        hash: image.hash,
        takenDateTime: image.properties && image.properties.takenDateTime,
        fileModifyDate: image.properties && image.properties.fileModifyDate,
        fileCreateDate: image.properties && image.properties.fileCreateDate,
        fileSize: image.properties && image.properties.fileSize,
        camera: image.properties && image.properties.camera,
        tags: image.properties && image.properties.tags,
        pixelCount: image.properties && image.properties.pixelCount,
        imageNumber: image.properties && image.properties.imageNumber,
        fileType: image.properties && image.properties.fileType,
        pathHistory: image.pathHistory
    }));
}

exports.PhotoImageServices = PhotoImageServices;