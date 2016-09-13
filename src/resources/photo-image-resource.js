import {Log} from "../shared/log";

export class PhotoImageResource {
    constructor (photoImageServices) {
        this._photoImageServices = photoImageServices;
    }

    async getById (ctx) {
        let id = ctx.params.id;
        let image = await this._photoImageServices.getById(id);
        if (!image) {
            ctx.status = 404;
            return;
        }

        ctx.body = image;
        ctx.status = 200;
    }

    async query (ctx) {
        if (!ctx.query || !ctx.query.json) {
            ctx.status = 400;
            return;
        }

        let query = JSON.parse(ctx.query.json);

        let imageLookup = {};
        let addImages = images => {
            for (let image of images) {
                imageLookup[image.id] = image;
            }
        }

        if (query.unreadable) {
            addImages(await this._photoImageServices.findUnreadable());
        }

        if (query.missingTakenDate) {
            addImages(await this._photoImageServices.findMissingTakenDate());
        }

        let images = [];
        for (let id in imageLookup) {
            images.push(imageLookup[id]);
        }

        ctx.body = images;
    }
}