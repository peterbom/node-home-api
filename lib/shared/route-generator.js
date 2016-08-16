"use strict";

exports.__esModule = true;
exports.RouteGenerator = undefined;

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _authorizationMiddleware = require("../middleware/authorization-middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteGenerator = exports.RouteGenerator = function () {
    function RouteGenerator(securityResourceName) {
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
                    secureHandler: (0, _authorizationMiddleware.getSecureRouteHandler)(handler, _this.securityResourceName, securityActionName),
                    securityActionName: securityActionName
                };

                _this._routeDescriptors.push(routeDescriptor);
                return _this;
            };
        });
    }

    RouteGenerator.create = function create(securityResourceName) {
        return new RouteGenerator(securityResourceName);
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