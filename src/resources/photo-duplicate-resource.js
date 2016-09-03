
export class PhotoDuplicateResource {
    constructor (photoDirectoryDataAccess) {
        this._photoDirectoryDataAccess = photoDirectoryDataAccess;
    }

    async list (ctx) {
        ctx.body = await this._photoDirectoryDataAccess.getDuplicates();
    }

    async resolve (ctx) {
        let hash = ctx.params.id;

        // Expect the body to contain:
        // sameIds: [<_id1>, ...]
        // differentIds: [<_id1>, ...]
        let sameIds = ctx.request.body.sameIds;
        let differentIds = ctx.request.body.differentIds;

        await this._photoDirectoryDataAccess.resolveDuplicates(sameIds, differentIds);

        ctx.status = 200;
    }
}