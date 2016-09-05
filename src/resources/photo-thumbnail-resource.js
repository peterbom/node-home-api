import {Log} from "../shared/log";

export class PhotoThumbnailResource {
    constructor (exifTool) {
        this._exifTool = exifTool;
    }

    async get (ctx) {
        let path = ctx.params.id;
        let buffer = await this._exifTool.getThumbnail(path);
        ctx.body = buffer;
        ctx.response.type = "image/jpeg";
    }
}