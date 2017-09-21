const Log = require("./shared/log").Log;
const noop = require("./middleware/null-middleware").noop;

class AppLauncher {
    static launch(settings, components) {
        let app = components.app;
        Log.logger = components.logger;

        // Make all the components and settings available to each request.
        app.use(async (ctx, next) => {
            ctx.components = components;
            ctx.settings = settings;
            await next();
        });

        // General request-processing middleware
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

        if (settings.listen) {
            app.listen(settings.port);
            Log.info("Application started. Listening on port: " + settings.port);
        }
    }
}

exports.AppLauncher = AppLauncher;