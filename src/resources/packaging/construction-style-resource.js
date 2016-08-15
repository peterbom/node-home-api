
export class ConstructionStyleResource {
    constructor(dataAccess) {
        if (dataAccess === undefined) {
            throw new Error("dataAccess not defined");
        }

        this._dataAccess = dataAccess;
    }

    async list (ctx) {
        ctx.body = await this._dataAccess.getAll();
    }

    async get(ctx) {
        let id = Number.parseInt(ctx.params.id);
        if (Number.isNaN(id)) {
            ctx.status = 400;
            return;
        }

        let detail = await this._dataAccess.getDetail(id);
        if (!detail) {
            ctx.status = 404;
            return;
        }

        ctx.body = detail;
    }
}
