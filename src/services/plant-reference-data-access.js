const Log = require("../shared/log").Log;

class PlantReferenceDataAccess {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    constructor (dbManager) {
        this._plantReferences = dbManager.get("plantReferences");
        this._plantReferences.createIndex({"type": 1, "key": 1});
    }

    async findReferences(type, key) {
        return await this._plantReferences.find({type: type, key: key});
    }

    async insertReference(type, key, reference) {
        if (!type) throw new Error("type is not set");
        if (!key) throw new Error("key is not set");
        if (!reference.url && !reference.paper) {
            throw new Error("Neither URL nor paper specified for reference");
        }

        let references = await this.findReferences(type, key);
        let list = references ? references.list : [];

        reference = {
            type: type,
            key: key,
            url: reference.url,
            paper: reference.paper,
            extract: reference.extract
        };

        return await this._plantReferences.insert(reference);
    }

    async deleteReference(id) {
        await this._plantReferences.findOneAndDelete({_id: id});
    }

    async listReferences(type) {
        return await this._plantReferences.find({type: type});
    }
}

exports.PlantReferenceDataAccess = PlantReferenceDataAccess;