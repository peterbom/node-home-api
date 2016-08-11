import Application from "koa";

import {errorHandler} from "./middleware/error-handling-middleware";
import {corsConfig} from "./middleware/cors-middleware";
import {jsonBodyParser} from "./middleware/body-parsing-middleware";
import {bearerTokenParser} from "./middleware/token-parsing-middleware";
import * as routers from "./middleware/routing-middleware";

import {AuthProviderManager} from "./oidc/auth-provider-manager";

export let app;
export let authProviderManager;
export let appSettings;

export function initialize(settings) {

    // Set up exports first, in case they're used by subsequent initialization code
    app = new Application();
    appSettings = settings;

    if (settings.allowHttpRequests) {
        authProviderManager = new AuthProviderManager(settings.authSettings);
    } else {
        if (settings.jsonServiceFactory) {
            authProviderManager = new AuthProviderManager(settings.authSettings, settings.jsonServiceFactory);
        }
    }

    if (settings.middleware.errorHandler) {
        app.use(errorHandler);
    }

    if (settings.middleware.corsConfig) {
        app.use(corsConfig);
    }

    if (settings.middleware.bodyParser) {
        app.use(jsonBodyParser);
    }

    if (settings.middleware.unsecuredRoutes) {
        app.use(routers.authenticationRouter);
    }

    if (settings.middleware.requireBearerToken) {
        app.use(bearerTokenParser);
    }

    if (settings.middleware.securedRoutes) {
        app.use(routers.userRouter);
        app.use(routers.stagingPhotoRouter);
        app.use(routers.photoMovementRouter);

        // for (let router of routers.packagingRouters) {
        //     console.log("ROUTER>>>>>>>>>>>>>>>>>>>>>>>>>>> " + router);
        //     app.use(router);
        // }
        routers.packagingRouters.forEach(r => app.use(r));
    }

    if (!settings.isUnitTest) {
        app.listen(settings.port);
        console.log("Application started. Listening on port: " + settings.port);
    }
}
