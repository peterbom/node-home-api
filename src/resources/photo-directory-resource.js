
export class PhotoDirectoryResource {
    constructor (photoDirectoryDataAccess) {
        this._photoDirectoryDataAccess = photoDirectoryDataAccess;
    }

    async list (ctx) {
        ctx.body = await this._photoDirectoryDataAccess.getAll();
    }

    async update (ctx) {
    	let directoryPath = decodeURIComponent(ctx.params.id);
        let requestedOperation = ctx.request.body.operation;

        switch (requestedOperation) {
            case "invalidate":
                await this._photoDirectoryDataAccess.invalidate(directoryPath);
                break;
            case "index":
                ctx.body = await this._photoDirectoryDataAccess.index(directoryPath, 100);
                break;
            case "clean":
                await this._photoDirectoryDataAccess.clean(directoryPath);
                break;
            default:
                throw new Error("Unexpected operation: " + requestedOperation);
        }

    	ctx.status = 200;
    }
}
