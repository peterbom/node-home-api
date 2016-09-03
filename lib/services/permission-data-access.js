"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PermissionDataAccess = exports.PermissionDataAccess = function () {
    function PermissionDataAccess(dbManager) {
        _classCallCheck(this, PermissionDataAccess);

        this._users = dbManager.get("users");
    }

    PermissionDataAccess.prototype.getPermissions = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sub) {
            var user;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._users.findOne({ sub: sub });

                        case 2:
                            user = _context.sent;

                            if (user) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt("return", []);

                        case 5:
                            if (!(!user.email || !user.email_verified)) {
                                _context.next = 7;
                                break;
                            }

                            throw new Error("User must have email address set and verified to determine permissions");

                        case 7:
                            _context.t0 = user.email;
                            _context.next = _context.t0 === "pete_bomber@hotmail.com" ? 10 : _context.t0 === "petebomber@gmail.com" ? 10 : _context.t0 === "wanthanaj@gmail.com" ? 11 : 12;
                            break;

                        case 10:
                            return _context.abrupt("return", ["home_manage", "packaging_maintain", "site_maintain"]);

                        case 11:
                            return _context.abrupt("return", ["home_manage", "packaging_maintain"]);

                        case 12:
                            return _context.abrupt("return", []);

                        case 13:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getPermissions(_x) {
            return _ref.apply(this, arguments);
        }

        return getPermissions;
    }();

    return PermissionDataAccess;
}();