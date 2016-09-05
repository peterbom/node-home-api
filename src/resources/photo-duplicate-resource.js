import {Log} from "../shared/log";

export class PhotoDuplicateResource {
    constructor (photoDuplicateServices) {
        this._photoDuplicateServices = photoDuplicateServices;
    }

    async list (ctx) {
        ctx.body = await this._photoDuplicateServices.getDuplicates();
    }

    async resolve (ctx) {
        let hash = ctx.params.id;

        // Expect the body to contain:
        // sameIds: [<_id1>, ...]
        // differentIds: [<_id1>, ...]
        let sameIds = ctx.request.body.sameIds;
        let differentIds = ctx.request.body.differentIds;

        await this._photoDuplicateServices.resolveDuplicates(sameIds, differentIds);

        ctx.status = 200;
    }
}