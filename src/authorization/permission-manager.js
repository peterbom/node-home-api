
export class PermissionManager {
    getPermissions (email) {
        switch (email) {
            case "pete_bomber@hotmail.com":
            case "petebomber@gmail.com":
                return ["home_manage", "packaging_maintain", "experiment_perform"]
            case "wanthanaj@gmail.com":
                return ["home_manage", "packaging_maintain"]
            default:
                return [];
        }
    }
}
