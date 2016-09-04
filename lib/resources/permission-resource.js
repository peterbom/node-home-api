"use strict";

exports.__esModule = true;
exports.PermissionResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PermissionResource = exports.PermissionResource = function () {
    function PermissionResource(permissionDataAccess) {
        _classCallCheck(this, PermissionResource);

        this._permissionDataAccess = permissionDataAccess;
    }

    PermissionResource.prototype.getPermissions = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var idToken;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            idToken = ctx.request.idToken;

                            if (!(!idToken || !idToken.sub)) {
                                _context.next = 4;
                                break;
                            }

                            ctx.body = [];
                            return _context.abrupt("return");

                        case 4:
                            _context.next = 6;
                            return this._permissionDataAccess.getPermissions(idToken.sub);

                        case 6:
                            ctx.body = _context.sent;

                        case 7:
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

    return PermissionResource;
}();