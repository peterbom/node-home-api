import {Log} from "../shared/log";

export class PhotoFrameResource {
    constructor (photoFrameServices) {
        this._photoFrameServices = photoFrameServices;
    }

    async list (ctx) {
        ctx.body = await this._photoFrameServices.list();
    }

    async setImages (ctx) {
        let ids = ctx.request.body.ids;

        await this._photoFrameServices.setImages(ids);

        ctx.status = 200;
    }
}