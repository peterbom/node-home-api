const Log = require("../shared/log").Log;

class PlantReferenceResource {
    constructor (plantReferenceDataAccess) {
        if (plantReferenceDataAccess === undefined) {
            throw new Error("plantReferenceDataAccess not defined");
        }

        this._plantReferenceDataAccess = plantReferenceDataAccess;
    }

    async listCompanionHelp(ctx) {
        ctx.body = await this._plantReferenceDataAccess.listReferences("companion-help");
    }

    async listCompanionHinder(ctx) {
        ctx.body = await this._plantReferenceDataAccess.listReferences("companion-hinder");
    }

    async addCompanionHelpReference(ctx) {
        let tsn1 = Number.parseInt(ctx.params.tsn1);
        let tsn2 = Number.parseInt(ctx.params.tsn2);
        await this._plantReferenceDataAccess.insertReference(
            "companion-help",
            `${tsn1}-${tsn2}`,
            ctx.request.body);

        ctx.status = 200;
    }

    async addCompanionHinderReference(ctx) {
        let tsn1 = Number.parseInt(ctx.params.tsn1);
        let tsn2 = Number.parseInt(ctx.params.tsn2);
        await this._plantReferenceDataAccess.insertReference(
            "companion-hinder",
            `${tsn1}-${tsn2}`,
            ctx.request.body);

        ctx.status = 200;
    }

    async deleteReference(ctx) {
        let id = ctx.params.id;
        await this._plantReferenceDataAccess.deleteReference(id);

        ctx.status = 200;
    }
}

exports.PlantReferenceResource = PlantReferenceResource;