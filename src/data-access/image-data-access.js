import path from "path";
import md5 from "md5";

export class ImageDataAccess {
    constructor(dbManager) {
        this._imageInfos = dbManager.get("imageInfos");
        this._imageInfos.ensureIndex({"directoryPath":1,"filename":1});
        this._imageInfos.ensureIndex({"hash":1});
    }

    async getDiff(directoryPath, filenames) {
        directoryPath = directoryPath.toLowerCase();
        filenames = filenames.map(f => f.toLowerCase());

        let indexedResults = await this._imageInfos.find(
            {directoryPath: directoryPath, valid: true},
            {filename: 1});

        let result = {
            new: [],
            deleted: []
        }

        if (indexedResults.length === 0) {
            result.new = filenames;
            return result;
        }

        let filenameLookup = {};
        filenames.forEach(f => filenameLookup[f] = true);

        let indexedFilenameLookup = {};
        indexedResults.forEach(m => indexedFilenameLookup[m.filename] = true);

        for (let filename in filenameLookup) {
            if (!indexedFilenameLookup[filename]) {
                result.new.push(filename);
            }
        }

        for (let filename in indexedFilenameLookup) {
            if (!filenameLookup[filename]) {
                result.deleted.push(filename);
            }
        }

        return result;
    }

    async getIndexedDirectories() {
        let groups = await this._imageInfos.aggregate(
            {$group: {_id: "$directoryPath", count: {$sum: 1}}}
        );

        return groups.map(g => ({
            directoryPath: g._id,
            imageCount: g.count
        }));
    }

    async getImageFilenames(directoryPath) {
        directoryPath = directoryPath.toLowerCase();
        let images = await this._imageInfos.find(
            {directoryPath: directoryPath, valid: true},
            {filename: 1});

        return images.map(i => i.filename);
    }

    async cleanExcept(directoryPath, filenames) {
        directoryPath = directoryPath.toLowerCase();
        filenames = filenames.map(f => f.toLowerCase());
        await this._imageInfos.remove({directoryPath: directoryPath, filename: {$nin: filenames}});
    }

    async invalidateImages(directoryPath) {
        directoryPath = directoryPath.toLowerCase();
        await this._imageInfos.update(
            {directoryPath: directoryPath},
            {$set: {valid: false}},
            {multi: true});
    }

    async upsertImage(directoryPath, filename, imageProperties /* Can be null */) {
        let image = {
            directoryPath: directoryPath.toLowerCase(),
            filename: filename.toLowerCase(),
            hash: getImageHash(imageProperties),
            properties: imageProperties,
            valid: true
        };

        image = await this._imageInfos.findOneAndUpdate(
            {directoryPath: image.directoryPath, filename: image.filename},
            {$set: image},
            {upsert: true});

        if (!image.pathHistory) {
            image.pathHistory = [{
                date: new Date(),
                filePath: path.join(image.directoryPath, image.filename)
            }];

            image = await this._imageInfos.update({_id: image._id}, image);
        }
    }
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