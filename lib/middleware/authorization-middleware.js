"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var authorizationChecker = exports.authorizationChecker = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (ctx.request.accessToken) {
                            _context.next = 4;
                            break;
                        }

                        // TODO: Logging
                        console.log("----- No token provided. Forbidden. -----");
                        ctx.status = 403; // forbidden (no token)
                        return _context.abrupt("return");

                    case 4:
                        _context.next = 6;
                        return next();

                    case 6:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function authorizationChecker(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();