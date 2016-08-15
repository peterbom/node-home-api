"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserDataAccess = exports.UserDataAccess = function () {
    function UserDataAccess() {
        _classCallCheck(this, UserDataAccess);

        this._users = [];
        this._newUserId = 1;
    }

    UserDataAccess.prototype.findUser = function findUser(idVal) {
        var id = Number.parseInt(idVal);
        if (id === NaN) {
            return null;
        }

        return this._users.find(function (u) {
            return u._id === id;
        });
    };

    UserDataAccess.prototype.addUser = function addUser(userData) {
        var userObject = Object.assign({ _id: this._newUserId++ }, userData);
        this._users.push(userObject);

        return userObject;
    };

    UserDataAccess.prototype.updateUser = function updateUser(id, newUserData) {
        var index = this._users.findIndex(function (u) {
            return u._id === id;
        });
        if (index === -1) {
            throw new RangeError("this._users collection does not contain an item with id " + id);
        }

        var newUser = Object.assign({ _id: id }, newUserData);
        this._users.splice(index, 1, newUser);

        return newUser;
    };

    UserDataAccess.prototype.deleteUser = function deleteUser(id) {
        var index = this._users.findIndex(function (u) {
            return u._id === id;
        });
        if (index === -1) {
            throw new RangeError("this._users collection does not contain an item with id " + id);
        }

        this._users.splice(index, 1);
    };

    UserDataAccess.prototype.clearUsers = function clearUsers() {
        this._users = [];
    };

    UserDataAccess.prototype.listUsers = function listUsers() {
        return this._users;
    };

    return UserDataAccess;
}();