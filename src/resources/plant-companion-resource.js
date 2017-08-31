const Log = require("../shared/log").Log;

class PlantCompanionResource {
    constructor (plantCompanionDataAccess) {
        if (plantCompanionDataAccess === undefined) {
            throw new Error("plantCompanionDataAccess not defined");
        }

        this._plantCompanionDataAccess = plantCompanionDataAccess;
    }

    async list(ctx) {
        ctx.body = await this._plantCompanionDataAccess.listPlantCompanions();
    }

    async set(ctx) {
        let tsn = Number.parseInt(ctx.params.tsn);
        if (Number.isNaN(tsn)) {
            ctx.status = 500;
            return;
        }

        let helps = ctx.request.body.helps;
        let hinders = ctx.request.body.hinders;
        if (!helps || !hinders ||
            helps.some(tsn => Number.isNaN(tsn)) ||
            hinders.some(tsn => Number.isNaN(tsn))) {

            ctx.status = 500;
            return;
        }

        helps = helps.map(tsn => Number.parseInt(tsn));
        hinders = hinders.map(tsn => Number.parseInt(tsn));

        await this._plantCompanionDataAccess.upsertCompanions(tsn, helps, hinders);

        ctx.status = 200;
    }

    async get(ctx) {
        let tsn = Number.parseInt(ctx.params.tsn);
        if (Number.isNaN(tsn)) {
            ctx.status = 500;
            return;
        }

        let companions = await this._plantCompanionDataAccess.findCompanions(tsn);
        if (!companions) {
            ctx.status = 404;
            return;
        }

        ctx.body = companions;
    }

    async delete(ctx) {
        let tsn = Number.parseInt(ctx.params.tsn);
        if (Number.isNaN(tsn)) {
            ctx.status = 500;
            return;
        }

        await this._plantCompanionDataAccess.deleteCompanions(tsn);

        ctx.status = 200;
    }
}

exports.PlantCompanionResource = PlantCompanionResource;