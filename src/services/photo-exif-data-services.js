import {Log} from "../shared/log";
import path from "path";

export class PhotoExifDataServices {
    constructor (exifTool, photoImageDataAccess) {
        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
    }

    async getByImageId(id, includeAll, includeThumbnails) {
        let image = await this._photoImageDataAccess.getById(id);
        let lookup = await imagesToExifData(this._exifTool, [image], includeAll, includeThumbnails);
        return lookup[image._id];
    }

    async getByImageIds(ids, includeAll, includeThumbnails) {
        let images = await this._photoImageDataAccess.getByIds(ids);
        return await imagesToExifData(this._exifTool, images, includeAll, includeThumbnails);
    }

    async getByImageHash(hash, includeAll, includeThumbnails) {
        let images = await this._photoImageDataAccess.getByHash(hash);
        return await imagesToExifData(this._exifTool, images, includeAll, includeThumbnails);
    }
}

async function imagesToExifData(exifTool, images, includeAll, includeThumbnails) {
    if (!images.length) {
        return {};
    }

    let filePaths = images.map(i => path.join(i.directoryPath, i.filename));

    let results = {};
    images.forEach(i => results[i._id] = {});
    if (includeAll) {
        let allTags = await exifTool.getAllTags(...filePaths);
        for (let i = 0; i < images.length; i++) {
            let imageId = images[i]._id;
            Object.assign(results[imageId], allTags[i]);
        }
    }

    if (includeThumbnails) {
        let thumbnails = await exifTool.getThumbnails(...filePaths);
        for (let i = 0; i < images.length; i++) {
            let imageId = images[i]._id;
            Object.assign(results[imageId], thumbnails[i]);
        }
    }

    return results;
}