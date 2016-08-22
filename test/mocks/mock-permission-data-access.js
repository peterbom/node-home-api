
export class MockPermissionDataAccess {
    constructor (permissionLookup) {
        this._permissionLookup = permissionLookup;
    }

    async getPermissions(sub) {
        return this._permissionLookup[sub];
    }
}
