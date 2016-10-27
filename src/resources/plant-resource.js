import {Log} from "../shared/log";

export class PlantResource {
    constructor (plantDataAccess) {
        if (plantDataAccess === undefined) {
            throw new Error("plantDataAccess not defined");
        }

        this._plantDataAccess = plantDataAccess;
    }

    async listPlants(ctx) {
        ctx.body = await this._plantDataAccess.listPlants();
    }

    async listLinks(ctx) {
        ctx.body = await this._plantDataAccess.listLinks();
    }

    async set(ctx) {
        let tsn = Number.parseInt(ctx.params.tsn);
        if (Number.isNaN(tsn)) {
            ctx.status = 500;
            return;
        }

        let plant = ctx.request.body;
        await this._plantDataAccess.upsertPlant(tsn, plant);
        ctx.status = 200;
    }

    async get(ctx) {
        let plant = await this._plantDataAccess.findPlant(Number.parseInt(ctx.params.tsn));
        if (!plant) {
            ctx.status = 404;
            return;
        }

        ctx.body = plant;
    }
}
