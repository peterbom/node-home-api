const Log = require("../shared/log").Log;

class PhotoIndexResource {
    constructor (photoIndexServices) {
        this._photoIndexServices = photoIndexServices;
    }

    async listDirectories (ctx) {
        ctx.body = await this._photoIndexServices.listDirectories();
    }

    async compare (ctx) {
        let directoryPath = ctx.params.path;
        ctx.body = await this._photoIndexServices.compare(directoryPath);
    }

    async apply (ctx) {
        let requestedOperation = ctx.request.body.operation;

        let directoryPath = ctx.request.body.directoryPath;
        if (directoryPath) {
            switch (requestedOperation) {
                case "invalidate":
                    await this._photoIndexServices.invalidatePath(directoryPath);
                    break;
                case "index":
                    ctx.body = await this._photoIndexServices.indexPath(directoryPath, 20);
                    break;
                case "clean":
                    await this._photoIndexServices.cleanPath(directoryPath);
                    break;
                default:
                    throw new Error("Unexpected operation: " + requestedOperation);
            }
        }

        let ids = ctx.request.body.imageIds;
        if (ids && ids.length) {
            switch (requestedOperation) {
                case "invalidate":
                    await this._photoIndexServices.invalidateImageIds(ids);
                    break;
                case "index":
                    ctx.body = await this._photoIndexServices.indexImageIds(ids);
                    break;
                case "clean":
                    await this._photoIndexServices.cleanImageIds(ids);
                    break;
                default:
                    throw new Error("Unexpected operation: " + requestedOperation);
            }
        }


        ctx.status = 200;
    }
}

exports.PhotoIndexResource = PhotoIndexResource;