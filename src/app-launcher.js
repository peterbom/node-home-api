const Log = require("./shared/log").Log;
const noop = require("./middleware/null-middleware").noop;

class AppLauncher {
    static launch(components) {
        let app = components.app;
        let settings = components.appSettings;
        Log.logger = components.logger;

        app.use(components.middleware.errorHandler || noop);
        app.use(components.middleware.corsConfig || noop);
        app.use(components.middleware.bodyParser || noop);
        app.use(components.middleware.tokenParser || noop);
        app.use(components.middleware.userUpdater || noop);

        for (let routeGenerator of components.middleware.unsecuredRouteGenerators) {
            if (routeGenerator.securityResourceName) {
                throw new Error("Router with security resource specified under unsecured routers")
            }

            app.use(routeGenerator.toMiddleware());
        }

        if (!settings.suppressAuthorization) {
            app.use(components.middleware.authorizationChecker || noop);
        }

        for (let routeGenerator of components.middleware.securedRouteGenerators) {
            if (!routeGenerator.securityResourceName) {
                throw new Error("Router without security resource specified under secured routers")
            }

            app.use(routeGenerator.toMiddleware(settings.suppressAuthorization));
        }

        if (!settings.isUnitTest) {
            app.listen(settings.port);
            Log.info("Application started. Listening on port: " + settings.port);
        }
    }
}

exports.AppLauncher = AppLauncher;