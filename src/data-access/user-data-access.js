
export class UserDataAccess {
    constructor () {
        this._users = [];
        this._newUserId = 1;
    }

    findUser(idVal) {
        let id = Number.parseInt(idVal);
        if (id === NaN) {
            return null;
        }

        return this._users.find(u => u._id === id);
    }

    addUser(userData) {
        let userObject = Object.assign({_id: this._newUserId++}, userData);
        this._users.push(userObject);

        return userObject;
    }

    updateUser(id, newUserData) {
        let index = this._users.findIndex(u => u._id === id);
        if (index === -1) {
            throw new RangeError(`this._users collection does not contain an item with id ${id}`);
        }

        let newUser = Object.assign({_id: id}, newUserData);
        this._users.splice(index, 1, newUser);

        return newUser;
    }

    deleteUser(id) {
        let index = this._users.findIndex(u => u._id === id);
        if (index === -1) {
            throw new RangeError(`this._users collection does not contain an item with id ${id}`);
        }

        this._users.splice(index, 1);
    }

    clearUsers() {
        this._users = [];
    }

    listUsers() {
        return this._users;
    }
}
