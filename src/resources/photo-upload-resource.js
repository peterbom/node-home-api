import {Log} from "../shared/log";

export class PhotoUploadResource {
    constructor (photoUploadServices) {
        this._photoUploadServices = photoUploadServices;
    }

    async create(ctx) {
        let upload = await this._photoUploadServices.create();

        ctx.set("location", `/photo-upload/${upload._id}`);
        ctx.body = upload;
        ctx.status = 201;
    }

    async addFile(ctx) {
        let uploadId = ctx.params.uploadId;
        let filename = ctx.params.filename;

        let upload = await this._photoUploadServices.getUpload(uploadId);
        if (!upload) {
            ctx.status = 404;
            ctx.body = `Upload id ${uploadId} not found`;
            return;
        }

        await this._photoUploadServices.addFile(upload, filename, ctx.req);

        ctx.status = 200;
    }
}