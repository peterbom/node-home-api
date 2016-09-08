import {Log} from "../shared/log";

export class PhotoExifDataResource {
    constructor (photoExifDataServices) {
        this._photoExifDataServices = photoExifDataServices;
    }

    async get (ctx) {
        let id = ctx.params.id;
        let includeAll = !ctx.query.thumbnailsOnly;
        let includeThumbnails = ctx.query.thumbnailsOnly || ctx.query.includeThumbnails;

        ctx.body = await this._photoExifDataServices.getByImageId(
            id,
            includeAll,
            includeThumbnails);
    }

    async query (ctx) {
        if (!ctx.query || !ctx.query.json) {
            ctx.status = 400;
            return;
        }

        let query = JSON.parse(ctx.query.json);
        let includeAll = !query.thumbnailsOnly;
        let includeThumbnails = query.thumbnailsOnly || query.includeThumbnails;
        if (query.ids) {
            ctx.body = await this._photoExifDataServices.getByImageIds(
                query.ids,
                includeAll,
                includeThumbnails);
        } else if (query.imageHash) {
            ctx.body = await this._photoExifDataServices.getByImageHash(
                query.imageHash,
                includeAll,
                includeThumbnails);
        }
    }

    async updateMany (ctx) {
        let updates = ctx.request.body.updates;
        let propertyName = ctx.request.body.propertyName;
        let type = ctx.request.body.type;

        await this._photoExifDataServices.updateMany(updates, propertyName, type);

        ctx.status = 200;
    }
}