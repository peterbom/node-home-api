const Log = require("../../src/shared/log").Log;

class MockPermissionDataAccess {
    constructor (permissionLookup) {
        this._permissionLookup = permissionLookup;
    }

    async getPermissions(sub) {
        return this._permissionLookup[sub];
    }
}

exports.MockPermissionDataAccess = MockPermissionDataAccess;