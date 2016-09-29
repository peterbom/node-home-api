import {Log} from "../shared/log";

export class PhotoFrameResource {
    constructor (photoFrameServices) {
        this._photoFrameServices = photoFrameServices;
    }

    async list (ctx) {
        ctx.body = await this._photoFrameServices.list();
    }

    async addImages (ctx) {
        let ids = ctx.request.body.ids;

        await this._photoFrameServices.addImages(ids);
        ctx.status = 200;
    }

    async clearImages (ctx) {
        await this._photoFrameServices.clearImages();
        ctx.status = 200;
    }
}