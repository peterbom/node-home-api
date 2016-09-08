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

    async updateMany(updates, propertyName, type) {
        let ids = updates.map(u => u.id);
        let images = await this._photoImageDataAccess.getByIds(ids);

        // Create a lookup from the images
        let valueLookup = {};
        updates.forEach(u => valueLookup[u.id] = u.value);

        for (let image of images) {
            let filePath = path.join(image.directoryPath, image.filename);
            switch (type) {
                case "string":
                    await this._exifTool.setStringProperty(filePath, propertyName, valueLookup[image._id]);
                    break;
                case "int":
                    await this._exifTool.setIntegerProperty(filePath, propertyName, valueLookup[image._id]);
                    break;
                case "date":
                    await this._exifTool.setDateProperty(filePath, propertyName, valueLookup[image._id]);
                    break;
                default:
                    throw new Error("Unexpected property type: " + type);
            }
        }

        await this._photoImageDataAccess.invalidateImageIds(ids);
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