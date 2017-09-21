const Log = require("../shared/log").Log;

class UserDataAccess {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    constructor (dbManager) {
        this._users = dbManager.get("users", {castIds: false});
    }

    async findUser(sub) {
        return await this._users.findOne({_id: sub});
    }

    async upsertUser(userData) {
        if (!userData.sub) {
            throw new Error("sub is not set");
        }

        userData = Object.assign({_id: userData.sub}, userData);

        return await this._users.findOneAndUpdate({_id: userData.sub}, userData, {upsert: true});
    }

    async updateUser(sub, newUserData) {
        // Ensure the new user data has a sub property
        Object.assign(newUserData, {_id: sub});
        return await this._users.findOneAndUpdate({_id: sub}, newUserData);
    }

    async deleteUser(sub) {
        await this._users.findOneAndDelete({_id: sub});
    }

    async clearUsers() {
        await this._users.remove();
    }

    async listUsers() {
        return await this._users.find();
    }
}

exports.UserDataAccess = UserDataAccess;