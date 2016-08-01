"use strict";

exports.__esModule = true;
exports.remove = exports.update = exports.get = exports.add = undefined;

var add = exports.add = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var insertedUser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // TODO: validation
                        insertedUser = (0, _user.addUser)(ctx.request.body);


                        ctx.set("location", "/user/" + insertedUser._id);
                        ctx.status = 201;

                    case 3:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function add(_x) {
        return _ref.apply(this, arguments);
    };
}();

var get = exports.get = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        user = (0, _user.findUser)(ctx.params.id);

                        if (user) {
                            _context2.next = 4;
                            break;
                        }

                        ctx.status = 404;
                        return _context2.abrupt("return");

                    case 4:

                        ctx.body = user;

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function get(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        var user, updatedUser;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        user = (0, _user.findUser)(ctx.params.id);

                        if (user) {
                            _context3.next = 4;
                            break;
                        }

                        ctx.status = 404;
                        return _context3.abrupt("return");

                    case 4:

                        // TODO: validation
                        updatedUser = (0, _user.updateUser)(user._id, ctx.request.body);


                        ctx.body = updatedUser;
                        ctx.set("location", "/user/" + updatedUser._id);

                        // http://blog.ploeh.dk/2013/04/30/rest-lesson-learned-avoid-204-responses/
                        ctx.status = 200;

                    case 8:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function update(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
        var user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        user = (0, _user.findUser)(ctx.params.id);

                        if (user) {
                            _context4.next = 4;
                            break;
                        }

                        ctx.status = 404;
                        return _context4.abrupt("return");

                    case 4:

                        (0, _user.deleteUser)(user._id);
                        ctx.status = 200;

                    case 6:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function remove(_x4) {
        return _ref4.apply(this, arguments);
    };
}();

var _user = require("../data-access/user");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }