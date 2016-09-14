import {Log} from "../shared/log";
import path from "path";

export class PhotoImageDataAccess {
    constructor(dbManager, imageUtils) {
        this._imageUtils = imageUtils;

        this._photoImages = dbManager.get("photoImages");
        this._photoImages.ensureIndex({"directoryPath":1,"filename":1});
        this._photoImages.ensureIndex({"hash":1});
        this._photoImages.ensureIndex({"properties.takenDateTime":1});
    }

    async getIds(includeInvalid = false, includeUnreadable = false, includeUndated = false) {
        let criteria = {};
        if (!includeInvalid) {
            criteria.valid = true;
        }

        if (!includeUnreadable) {
            criteria.properties = {$ne: null};
        }

        if (!includeUndated) {
            criteria["properties.takenDateTime"] = {$ne: null};
        }

        let results = await this._photoImages.find(
            criteria,
            {fields: {_id: 1}});

        return results.map(r => r._id);
    }

    async getById(id) {
        return await this._photoImages.findOne({_id: id});
    }

    async getByIds(ids, includeInvalid = false) {
        let criteria = {_id: {$in: ids}};
        if (!includeInvalid) {
            criteria.valid = true;
        }

        return await this._photoImages.find(criteria);
    }

    async getByHash(hash, includeInvalid = false) {
        let criteria = {hash: hash};
        if (!includeInvalid) {
            criteria.valid = true;
        }

        return await this._photoImages.find(criteria);
    }

    async getByPath(directoryPath, includeInvalid = false) {
        let criteria = {directoryPath: directoryPath};
        if (!includeInvalid) {
            criteria.valid = true;
        }

        return await this._photoImages.find(criteria);
    }

    async findUnreadable() {
        return await this._photoImages.find({properties: null, valid: true});
    }

    async findMissingTakenDate() {
        return await this._photoImages.find({
            properties: {$ne: null},
            "properties.takenDateTime": null,
            valid: true
        });
    }

    async findPathsRequiringMovement() {
        let results = await this._photoImages.find(
            {requiresMovement: true, valid: true},
            {_id: 1, directoryPath: 1}
        );

        let paths = {};
        for (let result of results) {
            let ids = paths[result.directoryPath] = paths[result.directoryPath] || [];
            ids.push(result._id);
        }

        return paths;
    }

    async findImagesRequiringMovement(directoryPath) {
        return await this._photoImages.find({
            directoryPath: directoryPath,
            requiresMovement: true,
            valid: true
        });
    }

    async getDiff(directoryPath, filenames) {
        let indexedResults = await this._photoImages.find(
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
        let groups = await this._photoImages.aggregate(
            {$group: {_id: "$directoryPath", count: {$sum: 1}}}
        );

        return groups.map(g => ({
            directoryPath: g._id,
            imageCount: g.count
        }));
    }

    async cleanExcept(directoryPath, filenames) {
        await this._photoImages.remove({directoryPath: directoryPath, filename: {$nin: filenames}});
    }

    async cleanIds(ids) {
        await this._photoImages.remove({_id: {$in: ids}});
    }

    async invalidateImageIds(ids) {
        await this._photoImages.update(
            {_id: {$in: ids}},
            {$set: {valid: false}},
            {multi: true});
    }

    async invalidateImage(directoryPath, filename) {
        await this._photoImages.update(
            {directoryPath: directoryPath, filename: filename},
            {$set: {valid: false}});
    }

    async invalidateImages(directoryPath) {
        await this._photoImages.update(
            {directoryPath: directoryPath},
            {$set: {valid: false}},
            {multi: true});
    }

    async upsertImage(directoryPath, filename, imageProperties /* Can be null */) {
        let image = {
            directoryPath: directoryPath,
            filename: filename,
            hash: this._imageUtils.getImageHash(imageProperties),
            properties: imageProperties,
            requiresMovement: this._imageUtils.requiresMovement(directoryPath, filename, imageProperties),
            valid: true
        };

        image = await this._photoImages.findOneAndUpdate(
            {directoryPath: directoryPath, filename: filename},
            {$set: image},
            {upsert: true});

        if (!image.pathHistory && imageProperties) {
            image.pathHistory = [{
                date: imageProperties.fileCreateDate,
                filePath: path.join(directoryPath, filename)
            }];

            image = await this._photoImages.update({_id: image._id}, image);
        }
    }

    async updateLocation(id, directoryPath, filename) {
        let image = await this._photoImages.findOne({_id: id});
        if (!image) {
            return;
        }

        image.directoryPath = directoryPath;
        image.filename = filename;
        image.pathHistory.push({
            date: new Date(),
            path: newPath
        });
        image.requiresMovement = this._imageUtils.requiresMovement(directoryPath, filename, image.properties);

        await this._photoImages.update({_id: id}, image);
    }

    async listDuplicateHashes() {
        let groups = await this._photoImages.aggregate([
            {$match: {hash: {$ne: null}}},
            {$group: {_id: "$hash", count: {$sum: 1}}},
            {$match: {count: {$gt: 1}}},
            {$sort: {count: -1}}
        ]);

        return groups.map(group => group._id);
    }

    async combineDuplicateHistories(ids) {
        let duplicates = await this._photoImages.find({_id: {$in: ids}});

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
            .map(img => img.pathHistory)
            .reduce((history1, history2) => history1.concat(history2), [])
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
            let latestDate = duplicate.pathHistory[duplicate.pathHistory.length - 1].date;
            duplicate.pathHistory = uniquePathHistoryEvents.filter(event => {
                return event.date <= latestDate;
            });

            updatePromises.push(this._photoImages.update({_id: duplicate._id}, duplicate));
        }

        await Promise.all(updatePromises);
    }
}
