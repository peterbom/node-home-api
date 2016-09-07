import {Log} from "../shared/log";
import path from "path";

export class PhotoDuplicateServices {
    constructor (exifTool, photoImageDataAccess) {
        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
    }

    async listDuplicates() {
        let hashes = await this._photoImageDataAccess.listDuplicateHashes();

        let result = {};
        let resultPromises = [];
        for (let hash of hashes) {
            let updateResult = async () => {
                result[hash] = await this.getDuplicates(hash);
            };

            resultPromises.push(updateResult());
        }

        await Promise.all(resultPromises);
        return result;
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
            await this._exifTool.setImageNumber(filePath, imageNumber++);
        }

        await this._photoImageDataAccess.invalidateImageIds(differentIds);
    }
}
