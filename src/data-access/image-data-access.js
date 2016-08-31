import path from "path";
import md5 from "md5";

export class ImageDataAccess {
    constructor(dbManager) {
        this._imageInfos = dbManager.get("imageInfos");
        this._imageInfos.ensureIndex({"path":1,"filename":1});
        this._imageInfos.ensureIndex({"hash":1});
    }

    async hasUnknownFiles(path, filenames) {
        path = path.toLowerCase();
        filenames = filenames.map(f => f.toLowerCase());
        let matches = await this._imageInfos.find(
            {path: path, filename: {$in: filenames}},
            {filename: 1});

        let knownFilenames = matches.map(m => m.filename);
        return filenames.some(f => knownFilenames.indexOf(f) < 0);
    }

    async upsertImage(directory, filename, imageProperties /* Can be null */) {
        let image = {
            path: directory.toLowerCase(),
            filename: filename.toLowerCase(),
            hash: getImageHash(imageProperties),
            properties: imageProperties
        };

        image = await this._imageInfos.findOneAndUpdate(
            {path: image.path, filename: image.filename},
            {$set: image},
            {upsert: true});

        if (!image.pathHistory) {
            image.pathHistory = [{
                date: new Date(),
                filePath: path.join(image.path, image.filename)
            }];

            image = await this._imageInfos.update({_id: image._id}, image);
        }
    }
/*
    async hasImage(inode) {
        let result = await this._imageInfos.findOne({inode: inode}, {_id: 1});
        return !!result;
    }

    async findImage(inode) {
        return await this._imageInfos.findOne({inode: inode});
    }

    async upsertLocation(inode, path, filename) {
        let updates = {
            inode: inode,
            path: path.toLowerCase(),
            filename: filename.toLowerCase()
        }

        return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
    }

    async upsertImage(inode, path, filename, imageData, tags) {
        let updates = {
            inode: inode,
            path: path.toLowerCase(),
            filename: filename.toLowerCase(),
            imageData: imageData,
            tags: tags
        };

        return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
    }
*/
}

function getImageHash(imageProperties) {
    if (!imageProperties) {
        return null;
    }

    let identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime || imageProperties.fileModifyDate,
        pixels: imageProperties.pixelCount
    };

    return md5(JSON.stringify(identifiers));
}