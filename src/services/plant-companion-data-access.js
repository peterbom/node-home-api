const Log = require("../shared/log").Log;

class PlantCompanionDataAccess {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    constructor (dbManager) {
        this._plantCompanions = dbManager.get("plantCompanions");
    }

    async findCompanions(tsn) {
        return await this._plantCompanions.findOne({_id: tsn});
    }

    async upsertCompanions(tsn, helps, hinders) {
        if (!tsn) throw new Error("tsn is not set");
        if (!helps) throw new Error("helps is not set");
        if (!hinders) throw new Error("hinders is not set");

        helps.forEach(tsn => {
            if (Number.isNaN(tsn)) {
                throw new Error("helps tsn is not a number");
            }
        });

        hinders.forEach(tsn => {
            if (Number.isNaN(tsn)) {
                throw new Error("hinders tsn is not a number");
            }
        });

        let plantCompanions = {
            _id: tsn,
            helps: helps.map(tsn => tsn),
            hinders: hinders.map(tsn => tsn)
        };

        await this._plantCompanions.findOneAndUpdate({_id: tsn}, plantCompanions, {upsert: true});
    }

    async listPlantCompanions() {
        return await this._plantCompanions.find();
    }

    async deleteCompanions(tsn) {
        await this._plantCompanions.remove({_id: tsn});
    }
}

exports.PlantCompanionDataAccess = PlantCompanionDataAccess;