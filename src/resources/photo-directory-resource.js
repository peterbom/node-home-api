
export class PhotoDirectoryResource {
    constructor (photoDirectoryDataAccess) {
        this._photoDirectoryDataAccess = photoDirectoryDataAccess;
    }

    async list (ctx) {
        ctx.body = await this._photoDirectoryDataAccess.getAll();
    }

    async update (ctx) {
    	let directory = decodeURIComponent(ctx.params.id);
    	await this._photoDirectoryDataAccess.reindex(directory);

    	ctx.status = 200;
    }
}
