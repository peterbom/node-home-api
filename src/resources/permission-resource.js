import {Log} from "../shared/log";

export class PermissionResource {
    constructor (permissionDataAccess) {
        this._permissionDataAccess = permissionDataAccess;
    }

    async getPermissions(ctx) {

        let idToken = ctx.request.idToken;
        if (!idToken || !idToken.sub) {
        	ctx.body = [];
        	return;
        }

        ctx.body = await this._permissionDataAccess.getPermissions(idToken.sub);
    }
}