
export class ImageDataAccess {
    constructor(dbManager) {
        this._imageInfos = dbManager.get("imageInfos");
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
}