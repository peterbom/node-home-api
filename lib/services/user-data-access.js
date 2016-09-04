"use strict";

exports.__esModule = true;
exports.UserDataAccess = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserDataAccess = exports.UserDataAccess = function () {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    function UserDataAccess(dbManager) {
        _classCallCheck(this, UserDataAccess);

        this._users = dbManager.get("users");
    }

    UserDataAccess.prototype.findUser = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sub) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._users.findOne({ sub: sub });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findUser(_x) {
            return _ref.apply(this, arguments);
        }

        return findUser;
    }();

    UserDataAccess.prototype.upsertUser = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(userData) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (userData.sub) {
                                _context2.next = 2;
                                break;
                            }

                            throw new Error("sub is not set");

                        case 2:
                            _context2.next = 4;
                            return this._users.findOneAndUpdate({ sub: userData.sub }, userData, { upsert: true });

                        case 4:
                            return _context2.abrupt("return", _context2.sent);

                        case 5:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function upsertUser(_x2) {
            return _ref2.apply(this, arguments);
        }

        return upsertUser;
    }();

    UserDataAccess.prototype.updateUser = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sub, newUserData) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            // Ensure the new user data has a sub property
                            Object.assign(newUserData, { sub: sub });
                            _context3.next = 3;
                            return this._users.findOneAndUpdate({ sub: sub }, newUserData);

                        case 3:
                            return _context3.abrupt("return", _context3.sent);

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function updateUser(_x3, _x4) {
            return _ref3.apply(this, arguments);
        }

        return updateUser;
    }();

    UserDataAccess.prototype.deleteUser = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(sub) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._users.findOneAndDelete({ sub: sub });

                        case 2:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function deleteUser(_x5) {
            return _ref4.apply(this, arguments);
        }

        return deleteUser;
    }();

    UserDataAccess.prototype.clearUsers = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this._users.remove();

                        case 2:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function clearUsers() {
            return _ref5.apply(this, arguments);
        }

        return clearUsers;
    }();

    UserDataAccess.prototype.listUsers = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return this._users.find();

                        case 2:
                            return _context6.abrupt("return", _context6.sent);

                        case 3:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function listUsers() {
            return _ref6.apply(this, arguments);
        }

        return listUsers;
    }();

    return UserDataAccess;
}();