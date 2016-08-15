import {noop} from "./middleware/null-middleware";

export class AppLauncher {
    static launch(components) {
        let app = components.app;
        let settings = components.appSettings;

        app.use(components.middleware.errorHandler || noop);
        app.use(components.middleware.corsConfig || noop);
        app.use(components.middleware.bodyParser || noop);
        app.use(components.middleware.tokenParser || noop);

        components.middleware.unsecuredRoutes.forEach(r => app.use(r));

        if (!settings.suppressAuthorization) {
            app.use(components.middleware.authorizationChecker || noop);
        }

        components.middleware.securedRoutes.forEach(r => app.use(r));

        if (!settings.isUnitTest) {
            app.listen(settings.port);
            console.log("Application started. Listening on port: " + settings.port);
        }
    }
}
