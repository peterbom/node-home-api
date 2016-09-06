import {Log} from "../shared/log";

export class PhotoImageServices {
    constructor (imageDataAccess) {
        this._imageDataAccess = imageDataAccess;
    }

    async findUnreadable () {
        let images = await this._imageDataAccess.findUnreadable();
        return toReturn(images);
    }

    async findMissingTakenDate () {
        let images = await this._imageDataAccess.findMissingTakenDate();
        return toReturn(images);
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