const Log = require("../../src/shared/log").Log;

class MockUserDataAccess {
    constructor (users) {
        this._users = users || [];
    }

    async clearUsers() {
        this._users = [];
    }

    async findUser(sub) {
        return this._users.find(u => u.sub === sub);
    }

    async upsertUser(user) {
        let upsertedUser = await this.findUser(user.sub);
        if (!upsertedUser) {
            upsertedUser = {sub: user.sub};
            this._users.push(upsertedUser);
        }

        upsertedUser.name = user.name;
        upsertedUser.city = user.city;

        return upsertedUser;
    }

    async updateUser(sub, user) {
        let updatedUser = await this.findUser(sub);
        updatedUser.name = user.name;
        updatedUser.city = user.city;

        return updatedUser;
    }

    async listUsers() {
        return this._users.map(u => Object.assign({}, u));
    }

    async deleteUser(sub) {
        let deleteUser = this.findUser(sub);
        if (deleteUser) {
            let index = this._users.indexOf(deleteUser);
            this._users.splice(index, 1);
        }
    }
}

exports.MockUserDataAccess = MockUserDataAccess;