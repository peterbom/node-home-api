const Log = require("../shared/log").Log;

class UserDataAccess {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    constructor (dbManager) {
        this._users = dbManager.get("users");
    }

    async findUser(sub) {
        return await this._users.findOne({sub: sub});
    }

    async upsertUser(userData) {
        if (!userData.sub) {
            throw new Error("sub is not set");
        }

        return await this._users.findOneAndUpdate({sub: userData.sub}, userData, {upsert: true});
    }

    async updateUser(sub, newUserData) {
        // Ensure the new user data has a sub property
        Object.assign(newUserData, {sub: sub});
        return await this._users.findOneAndUpdate({sub: sub}, newUserData);
    }

    async deleteUser(sub) {
        await this._users.findOneAndDelete({sub: sub});
    }

    async clearUsers() {
        await this._users.remove();
    }

    async listUsers() {
        return await this._users.find();
    }
}

exports.UserDataAccess = UserDataAccess;