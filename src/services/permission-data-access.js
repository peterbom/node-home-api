import {Log} from "../shared/log";

export class PermissionDataAccess {
    constructor (dbManager) {
        this._users = dbManager.get("users");
    }

    async getPermissions(sub) {
        let user = await this._users.findOne({sub: sub});
        if (!user) {
            return [];
        }

        if (!user.email || !user.email_verified) {
            throw new Error("User must have email address set and verified to determine permissions");
        }

        switch (user.email) {
            case "pete_bomber@hotmail.com":
            case "petebomber@gmail.com":
                return ["home_manage", "packaging_maintain", "site_maintain"]
            case "wanthanaj@gmail.com":
                return ["home_manage", "packaging_maintain"]
            default:
                return [];
        }
    }
}
