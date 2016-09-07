import {Log} from "../shared/log";

export class PhotoIndexResource {
    constructor (photoIndexServices) {
        this._photoIndexServices = photoIndexServices;
    }

    async compare (ctx) {
        ctx.body = await this._photoIndexServices.compare();
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
