const Log = require("../shared/log").Log;

class PermissionResource {
    async getPermissions(ctx) {

        if (!ctx.request.user || !ctx.request.user.permissions) {
        	ctx.body = [];
        	return;
        }

        ctx.body = ctx.request.user.permissions;
    }
}

exports.PermissionResource = PermissionResource;