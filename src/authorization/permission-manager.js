export function getPermissions(email) {
    switch (email) {
        case "pete_bomber@hotmail.com":
        case "petebomber@gmail.com":
        case "wanthanaj@gmail.com":
            return ["home_manage"]
        default:
            return [];
    }
}