
export class ImageDataAccess {
    constructor(dbManager) {
        this._imageInfos = dbManager.get("imageInfos");
    }

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
            path: path,
            filename: filename
        }

        return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
    }

    async upsertImage(inode, path, filename, imageData, tags) {
        let updates = {
            inode: inode,
            path: path,
            filename: filename,
            imageData: imageData,
            tags: tags
        };

        return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
    }
}