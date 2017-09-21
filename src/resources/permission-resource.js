const Log = require("../shared/log").Log;

class PermissionResource {
    async getPermissions(ctx) {

        if (!ctx.request.user || !ctx.request.user.permissions) {
        	ctx.body = [];
        	return;
        }

        let permissionLookup = ctx.request.user.permissions || {};
        ctx.body = Object.keys(permissionLookup).filter(k => k);
    }
}

exports.PermissionResource = PermissionResource;