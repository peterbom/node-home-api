import {Log} from "../shared/log";

export class PhotoDuplicateServices {
    constructor (exifTool, imageDataAccess) {
        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
    }

    async getDuplicates() {
        return await this._imageDataAccess.getDuplicates();
    }

    async resolveDuplicates(sameIds, differentIds) {
        if (sameIds.length > 1) {
            await this._imageDataAccess.combineDuplicateHistories(sameIds);
        }

        let differentImages = await Promise.all(differentIds.map(id => this._imageDataAccess.getById(id)));
        let imageNumber = 1;
        let directoryPathLookup = {};
        for (let image of differentImages) {
            directoryPathLookup[image.directoryPath] = true;
            let filePath = path.join(image.directoryPath, image.filename);
            await this._exifTool.setImageNumber(filePath, imageNumber++);
            await this._imageDataAccess.invalidateImage(image.directoryPath, image.filename);
        }

        for (directoryPath in directoryPathLookup) {
            await this.index(directoryPath, 100);
        }
    }
}
