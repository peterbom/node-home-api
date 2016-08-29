
export class PhotoDirectoryResource {
    constructor (photoDirectoryDataAccess) {
        this._photoDirectoryDataAccess = photoDirectoryDataAccess;
    }

    async list (ctx) {
        ctx.body = await this._photoDirectoryDataAccess.getAll();
    }
}
