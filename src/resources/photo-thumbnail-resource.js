import {Log} from "../shared/log";

export class PhotoThumbnailResource {
    constructor (exifTool) {
        this._exifTool = exifTool;
    }

    async get (ctx) {
        let path = ctx.params.id;
        let buffer = await this._exifTool.getThumbnail(path);

        // https://github.com/koajs/koa/blob/master/docs/api/response.md
        ctx.body = buffer;
        ctx.response.type = "image/jpeg";
    }
}