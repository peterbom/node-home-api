const Log = require("../shared/log").Log;

class PlantDataAccess {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    constructor (dbManager) {
        this._plants = dbManager.get("plants");
        this._plants.ensureIndex({"scientificName":1});

        this._plantHierarchy = dbManager.get("plantHierarchy");
    }

    async findPlant(tsn) {
        return await this._plants.findOne({_id: tsn});
    }

    async upsertPlant(tsn, properties) {
        // if (!properties.path) throw new Error("path is not set");
        // if (!properties.path.length) throw new Error("path is empty");
        if (!properties.scientificName) throw new Error("scientificName is not set");
        if (!properties.rankName) throw new Error("rankName is not set");

        //let tsn = properties.path[properties.path.length - 1];

        let plant = {
            _id: tsn,
            scientificName: properties.scientificName,
            commonName: properties.commonName,
            rankName: properties.rankName,
            use: properties.use
        };

        await this._plants.findOneAndUpdate({_id: tsn}, plant, {upsert: true});

        // if (properties.path.length > 1) {
        //     let parentTsn = properties.path[properties.path.length - 2];
        //     let hierarchy = {
        //         _id: tsn,
        //         parentId: parentTsn,
        //         path: properties.path
        //     }

        //     await this._plantHierarchy.findOneAndUpdate({_id: tsn}, hierarchy, {upsert: true});
        // }
    }

    async listPlants() {
        return await this._plants.find();
    }

    async listLinks() {
        return await this._plantHierarchy.find({}, {fields: {parentId: 1}});
    }
}

exports.PlantDataAccess = PlantDataAccess;