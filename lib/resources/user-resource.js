"use strict";

exports.__esModule = true;
exports.UserResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserResource = exports.UserResource = function () {
    function UserResource(userDataAccess) {
        _classCallCheck(this, UserResource);

        if (userDataAccess === undefined) {
            throw new Error("userDataAccess not defined");
        }

        this._userDataAccess = userDataAccess;
    }

    UserResource.prototype.list = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._userDataAccess.listUsers();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function list(_x) {
            return _ref.apply(this, arguments);
        }

        return list;
    }();

    UserResource.prototype.add = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var insertedUser;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._userDataAccess.upsertUser(ctx.request.body);

                        case 2:
                            insertedUser = _context2.sent;


                            ctx.set("location", "/user/" + insertedUser.sub);
                            ctx.status = 201;

                        case 5:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function add(_x2) {
            return _ref2.apply(this, arguments);
        }

        return add;
    }();

    UserResource.prototype.get = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._userDataAccess.findUser(ctx.params.id);

                        case 2:
                            user = _context3.sent;

                            if (user) {
                                _context3.next = 6;
                                break;
                            }

                            ctx.status = 404;
                            return _context3.abrupt("return");

                        case 6:

                            ctx.body = user;

                        case 7:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function get(_x3) {
            return _ref3.apply(this, arguments);
        }

        return get;
    }();

    UserResource.prototype.update = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
            var user, updatedUser;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._userDataAccess.findUser(ctx.params.id);

                        case 2:
                            user = _context4.sent;

                            if (user) {
                                _context4.next = 6;
                                break;
                            }

                            ctx.status = 404;
                            return _context4.abrupt("return");

                        case 6:
                            _context4.next = 8;
                            return this._userDataAccess.updateUser(user.sub, ctx.request.body);

                        case 8:
                            updatedUser = _context4.sent;


                            ctx.body = updatedUser;
                            ctx.set("location", "/user/" + updatedUser.sub);

                            // http://blog.ploeh.dk/2013/04/30/rest-lesson-learned-avoid-204-responses/
                            ctx.status = 200;

                        case 12:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function update(_x4) {
            return _ref4.apply(this, arguments);
        }

        return update;
    }();

    UserResource.prototype.remove = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
            var user;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this._userDataAccess.findUser(ctx.params.id);

                        case 2:
                            user = _context5.sent;

                            if (user) {
                                _context5.next = 6;
                                break;
                            }

                            ctx.status = 404;
                            return _context5.abrupt("return");

                        case 6:
                            _context5.next = 8;
                            return this._userDataAccess.deleteUser(user._id);

                        case 8:
                            ctx.status = 200;

                        case 9:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function remove(_x5) {
            return _ref5.apply(this, arguments);
        }

        return remove;
    }();

    return UserResource;
}();