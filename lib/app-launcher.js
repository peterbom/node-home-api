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

                components.middleware.unsecuredRoutes.forEach(function (r) {
                        return app.use(r);
                });

                if (!settings.suppressAuthorization) {
                        app.use(components.middleware.authorizationChecker || _nullMiddleware.noop);
                }

                components.middleware.securedRoutes.forEach(function (r) {
                        return app.use(r);
                });

                if (!settings.isUnitTest) {
                        app.listen(settings.port);
                        console.log("Application started. Listening on port: " + settings.port);
                }
        };

        return AppLauncher;
}();