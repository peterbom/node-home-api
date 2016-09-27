import {Log} from "../shared/log";
import path from "path";
import moment from "moment";

export class PhotoImageDataAccess {
    constructor(dbManager, imageUtils) {
        this._imageUtils = imageUtils;

        this._photoImages = dbManager.get("photoImages");
        this._photoImages.ensureIndex({"directoryPath":1,"filename":1});
        this._photoImages.ensureIndex({"hash":1});
        this._photoImages.ensureIndex({"requiresMovement":1});
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

    async findByCriteria(criteria) {
        let queryCriteria = {properties: {$ne: null}, valid: true};

        if (criteria.path) {
            queryCriteria.directoryPath = criteria.path;
        }

        if (criteria.fromDateTime || criteria.toDateTime) {
            let takenCriteria = {};
            if (criteria.fromDateTime) {
                takenCriteria.$gte = moment(criteria.fromDateTime).toDate();
            }

            if (criteria.toDateTime) {
                takenCriteria.$lt = moment(criteria.toDateTime).toDate();
            }

            queryCriteria["properties.takenDateTime"] = takenCriteria;
        }

        return await this._photoImages.find(queryCriteria);
    }

    async getTotalCount() {
        return await this._photoImages.count();
    }

    async getRequiringMovementCount() {
        return await this._photoImages.count({requiresMovement: true});
    }

    async getReadableCount() {
        return await this._photoImages.count({hash: {$ne: null}});
    }

    async getYearlySummary() {
        let group = {
            _id: { $year: "$properties.takenDateTime" },
            count: { $sum: 1 }
        };

        return await this._photoImages.aggregate([
            {$match: {"properties.takenDateTime": {$ne: null}}},
            {$group : group},
            {$sort: {_id: 1}},
            {$project: {_id: 0, year: "$_id", count: 1}}
        ]);
    }

    async findPathsRequiringMovement() {
        let group = {
            _id: "$directoryPath",
            totalCount: {$sum: 1},
            movableCount: {
                $sum: {
                    $cond: [{$eq: ["$requiresMovement", true]}, 1, 0]
                }
            }
        };

        return await this._photoImages.aggregate([
            {$group: group},
            {$match: {movableCount: {$gt: 0}}},
            {$sort: {"_id": 1}},
            {$project: {_id: 0, directoryPath: "$_id", totalCount: 1, movableCount: 1}}
        ]);
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
        return await this._photoImages.distinct("directoryPath");
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
            filePath: path.join(directoryPath, filename)
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
        for (let pathHistoryEvent of allPathHistoryEvents) {
            if (!lastEvent || lastEvent.path !== pathHistoryEvent.path) {
                uniquePathHistoryEvents.push(pathHistoryEvent);
                lastEvent = pathHistoryEvent;
            }
        }

        // For each duplicate, the path history includes all events up to and including
        // the current latest date
        let updatePromises = [];
        for (let duplicate of duplicates) {
            if (duplicate.pathHistory && duplicate.pathHistory.length > 0) {
                let latestDate = duplicate.pathHistory[duplicate.pathHistory.length - 1].date;
                duplicate.pathHistory = uniquePathHistoryEvents.filter(event => {
                    return event.date <= latestDate;
                });

                updatePromises.push(this._photoImages.update({_id: duplicate._id}, duplicate));
            }
        }

        await Promise.all(updatePromises);
    }
}
