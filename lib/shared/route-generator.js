"use strict";

exports.__esModule = true;
exports.RouteGenerator = undefined;

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function getSecureRouteHandler(permissionDataAccess, routeHandler, securityResourceName, securityActionName) {

    if (!securityResourceName && !securityActionName) {
        // No security checking needed.
        return routeHandler;
    }

    if (!securityResourceName) {
        throw new Error("Resource is not secured but security action " + securityActionName + " is specified");
    }

    if (!securityActionName) {
        throw new Error("Resource is secured with " + securityResourceName + " but no security action name is specified");
    }

    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var idToken, permissions, requiredPermission;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            idToken = ctx.request.idToken;

                            if (idToken) {
                                _context.next = 3;
                                break;
                            }

                            throw new Error("Resource is secured by " + securityActionName + " on " + securityResourceName + " but no access token is provided");

                        case 3:
                            if (idToken.sub) {
                                _context.next = 5;
                                break;
                            }

                            throw new Error("no \"sub\" claim on access token");

                        case 5:
                            _context.next = 7;
                            return permissionDataAccess.getPermissions(idToken.sub);

                        case 7:
                            permissions = _context.sent;
                            requiredPermission = securityResourceName + "_" + securityActionName;

                            if (!(permissions.indexOf(requiredPermission) < 0)) {
                                _context.next = 12;
                                break;
                            }

                            // Forbidden
                            ctx.status = 403;
                            return _context.abrupt("return");

                        case 12:
                            _context.next = 14;
                            return routeHandler(ctx);

                        case 14:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }();
}

var RouteGenerator = exports.RouteGenerator = function () {
    function RouteGenerator(permissionDataAccess, securityResourceName) {
        var _this = this;

        _classCallCheck(this, RouteGenerator);

        this.securityResourceName = securityResourceName;

        this._routeDescriptors = [];

        ["get", "post", "put", "delete"].forEach(function (method) {
            _this[method] = function (route, handler, securityActionName) {
                var routeDescriptor = {
                    method: method,
                    route: route,
                    bareHandler: handler,
                    secureHandler: getSecureRouteHandler(permissionDataAccess, handler, _this.securityResourceName, securityActionName),
                    securityActionName: securityActionName
                };

                _this._routeDescriptors.push(routeDescriptor);
                return _this;
            };
        });
    }

    RouteGenerator.create = function create(permissionDataAccess, securityResourceName) {
        return new RouteGenerator(permissionDataAccess, securityResourceName);
    };

    RouteGenerator.prototype.toMiddleware = function toMiddleware(suppressAuthorization) {
        var _this2 = this;

        return (0, _koaSimpleRouter2.default)(function (_) {
            _this2._routeDescriptors.forEach(function (r) {
                return _[r.method](r.route, suppressAuthorization ? r.bareHandler : r.secureHandler);
            });
        });
    };

    return RouteGenerator;
}();