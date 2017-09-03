const Log = require("../shared/log").Log;

class PermissionResource {
    async getPermissions(ctx) {

        let idToken = ctx.request.idToken;
        if (!idToken || !idToken.sub) {
        	ctx.body = [];
        	return;
        }

        ctx.body = await ctx.components.permissionDataAccess.getPermissions(idToken.sub);
    }
}

exports.PermissionResource = PermissionResource;