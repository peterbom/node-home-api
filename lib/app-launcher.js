"use strict";

exports.__esModule = true;
exports.AppLauncher = undefined;

var _nullMiddleware = require("./middleware/null-middleware");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppLauncher = exports.AppLauncher = function () {
    function AppLauncher() {
        _classCallCheck(this, AppLauncher);
    }

    AppLauncher.launch = function launch(components) {
        var app = components.app;
        var settings = components.appSettings;

        app.use(components.middleware.errorHandler || _nullMiddleware.noop);
        app.use(components.middleware.corsConfig || _nullMiddleware.noop);
        app.use(components.middleware.bodyParser || _nullMiddleware.noop);
        app.use(components.middleware.tokenParser || _nullMiddleware.noop);

        for (var _iterator = components.middleware.unsecuredRouteGenerators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var routeGenerator = _ref;

            if (routeGenerator.securityResourceName) {
                throw new Error("Router with security resource specified under unsecured routers");
            }

            app.use(routeGenerator.toMiddleware());
        }

        if (!settings.suppressAuthorization) {
            app.use(components.middleware.authorizationChecker || _nullMiddleware.noop);
        }

        for (var _iterator2 = components.middleware.securedRouteGenerators, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var _routeGenerator = _ref2;

            if (!_routeGenerator.securityResourceName) {
                throw new Error("Router without security resource specified under secured routers");
            }

            app.use(_routeGenerator.toMiddleware(settings.suppressAuthorization));
        }

        if (!settings.isUnitTest) {
            app.listen(settings.port);
            console.log("Application started. Listening on port: " + settings.port);
        }
    };

    return AppLauncher;
}();