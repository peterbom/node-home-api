"use strict";

exports.__esModule = true;
exports.getSecureRouteHandler = getSecureRouteHandler;

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
                        console.log("----- No token provided. Unauthorized. -----");

                        // If a token is missing or expired, the correct status code to
                        // return is 401.
                        ctx.status = 401; // unauthorized (no token, or token expired)
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

function getSecureRouteHandler(routeHandler, securityResourceName, securityActionName) {

    if (!securityResourceName && !securityActionName) {
        // No security checking needed.
        return routeHandler;
    }

    if (!securityResourceName) {
        throw new Error("Resource is not secured but no security action " + securityActionName + " is specified");
    }

    if (!securityActionName) {
        throw new Error("Resource is secured with " + securityResourceName + " but no security action name is specified");
    }

    return function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var accessToken, requiredPermission;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            accessToken = ctx.request.accessToken;

                            if (accessToken) {
                                _context2.next = 3;
                                break;
                            }

                            throw new Error("Resource is secured by " + securityActionName + " on " + securityResourceName + " but no access token is provided");

                        case 3:
                            if (accessToken.permissions) {
                                _context2.next = 5;
                                break;
                            }

                            throw new Error("no permissions collection found on access token");

                        case 5:
                            requiredPermission = securityResourceName + "_" + securityActionName;

                            if (!(accessToken.permissions.indexOf(requiredPermission) < 0)) {
                                _context2.next = 9;
                                break;
                            }

                            // Forbidden
                            ctx.status = 403;
                            return _context2.abrupt("return");

                        case 9:
                            _context2.next = 11;
                            return routeHandler(ctx);

                        case 11:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x3) {
            return _ref2.apply(this, arguments);
        };
    }();
}