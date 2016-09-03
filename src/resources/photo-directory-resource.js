
export class PhotoDirectoryResource {
    constructor (photoSyncServices) {
        this._photoSyncServices = photoSyncServices;
    }

    async list (ctx) {
        ctx.body = await this._photoSyncServices.getAll();
    }

    async update (ctx) {
        let directoryPath = decodeURIComponent(ctx.params.id);
        let requestedOperation = ctx.request.body.operation;

        switch (requestedOperation) {
            case "invalidate":
                await this._photoSyncServices.invalidate(directoryPath);
                break;
            case "index":
                ctx.body = await this._photoSyncServices.index(directoryPath, 20);
                break;
            case "clean":
                await this._photoSyncServices.clean(directoryPath);
                break;
            default:
                throw new Error("Unexpected operation: " + requestedOperation);
        }

        ctx.status = 200;
    }
}
