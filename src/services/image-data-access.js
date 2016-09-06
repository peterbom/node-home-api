import {Log} from "../shared/log";
import path from "path";
import md5 from "md5";

export class ImageDataAccess {
    constructor(dbManager) {
        this._imageInfos = dbManager.get("imageInfos");
        this._imageInfos.ensureIndex({"directoryPath":1,"filename":1});
        this._imageInfos.ensureIndex({"hash":1});
        this._imageInfos.ensureIndex({"properties.takenDateTime":1});
    }

    async getById(id) {
        return await this._imageInfos.findOne({_id: id});
    }

    async getByIds(ids) {
        return await this._imageInfos.find({_id: {$in: ids}});
    }

    async getByHash(hash) {
        return await this._imageInfos.find({hash: hash});
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

    async invalidateImage(directoryPath, filename) {
        directoryPath = directoryPath.toLowerCase();
        filename = filename.toLowerCase();

        await this._imageInfos.update(
            {directoryPath: directoryPath, filename: filename},
            {$set: {valid: false}});
    }

    async invalidateImages(directoryPath) {
        directoryPath = directoryPath.toLowerCase();
        await this._imageInfos.update(
            {directoryPath: directoryPath},
            {$set: {valid: false}},
            {multi: true});
    }

    async upsertImage(directoryPath, filename, imageProperties /* Can be null */) {
        directoryPath = directoryPath.toLowerCase();
        filename = filename.toLowerCase();

        let image = {
            directoryPath: directoryPath,
            filename: filename,
            hash: getImageHash(imageProperties),
            properties: imageProperties,
            valid: true
        };

        image = await this._imageInfos.findOneAndUpdate(
            {directoryPath: directoryPath, filename: filename},
            {$set: image},
            {upsert: true});

        if (!image.pathHistory && imageProperties) {
            image.pathHistory = [{
                date: imageProperties.fileCreateDate,
                filePath: path.join(directoryPath, filename)
            }];

            image = await this._imageInfos.update({_id: image._id}, image);
        }
    }

    async listDuplicateHashes() {
        let groups = await this._imageInfos.aggregate([
            {$match: {hash: {$ne: null}}},
            {$group: {_id: "$hash", count: {$sum: 1}}},
            {$match: {count: {$gt: 1}}},
            {$sort: {count: -1}}
        ]);

        return groups.map(group => group._id);
    }

    async combineDuplicateHistories(ids) {
        let duplicates = await this._imageInfos.find({_id: {$in: ids}});

        if (duplicates.length < 2) {
            // No duplicates
            return;
        }

        let hash = duplicates[0].hash;
        if (duplicates.some(d => d.hash !== hash)) {
            throw new Error("Expect all duplicates to have the same hash");
        }

        // Merge all the pathHistories together and order by date
        let allPathHistoryEvents = duplicates
            .reduce((img1, img2) => img1.pathHistory.concat(img2.pathHistory), [])
            .sort((event1, event2) => event1.date - event2.date);

        // Remove duplicates (including events where the path is unchanged)
        let uniquePathHistoryEvents = [];
        let lastEvent = null;
        for (let pathHistoryEvent of uniquePathHistoryEvents) {
            if (!lastEvent || lastEvent.path !== pathHistoryEvent.path) {
                uniquePathHistoryEvents.push(pathHistoryEvent);
                lastEvent = pathHistoryEvent;
            }
        }

        // For each duplicate, the path history includes all events up to and including
        // the current latest date
        let updatePromises = [];
        for (let duplicate of duplicates) {
            let latestDate = duplicate.pathHistory[duplicates.pathHistory.length - 1].date;
            duplicate.pathHistory = uniquePathHistoryEvents.filter(event => {
                return event.date <= latestDate;
            });

            updatePromises.push(this._imageInfos.update({_id: duplicate._id}, duplicate));
        }

        await Promise.all(updatePromises);
    }
}

function getImageHash(imageProperties) {
    if (!imageProperties) {
        return null;
    }

    let identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime || imageProperties.fileModifyDate,
        camera: imageProperties.camera,
        pixels: imageProperties.pixelCount,
        number: imageProperties.imageNumber
    };

    return md5(JSON.stringify(identifiers));
}