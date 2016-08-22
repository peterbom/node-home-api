import Application from "koa";
import {default as DbManager} from "monk";

// Shared components
import {JsonService} from "./shared/json-service";
import {JwtUtils} from "./shared/jwt-utils";

// Data access
import {UserDataAccess} from "./data-access/user-data-access";
import {PermissionDataAccess} from "./data-access/permission-data-access";

// API Resources
import {PermissionResource} from "./resources/permission-resource";
import {UserResource} from "./resources/user-resource";
import {StagingPhotoResource} from "./resources/staging-photo-resource";
import {PhotoMovementResource} from "./resources/photo-movement-resource";
import {WolResource} from "./resources/wol-resource";

// Middleware
import {noop} from "./middleware/null-middleware";
import {errorHandler} from "./middleware/error-handling-middleware";
import {corsConfig} from "./middleware/cors-middleware";
import {jsonBodyParser} from "./middleware/body-parsing-middleware";
import {getUserUpdater} from "./middleware/user-update-middleware";
import {getBearerTokenParser} from "./middleware/token-parsing-middleware";
import {authorizationChecker} from "./middleware/authorization-middleware";
import * as routingMiddleware from "./middleware/routing-middleware";

function getDefaultSettings () {
    return {
        isUnitTest: process.env.NODE_ENV === "test",
        port: process.env.PORT,
        authServer: process.env.AUTH_SERVER,
        authProviderSecret: process.env.AUTH_PROVIDER_SECRET,
        connectionString: process.env.NODE_ENV === "test" ? "localhost:27017/unitTest" : process.env.CONNECTION_STRING,
        suppressAuthorization: process.env.SUPPRESS_AUTHORIZATION === "1" && process.env.NODE_ENV === "development",
        macAddressLookup: {
            dev: "bc:5f:f4:36:5c:a0"
        }
    };
}

export function getDefaultComponents () {
    let settings = getDefaultSettings();
    
    let components = {
        appSettings: settings
    };

    components.app = new Application();

    components.dbManager = new DbManager(settings.connectionString);

    components.userDataAccess = new UserDataAccess(components.dbManager);
    components.permissionDataAccess = new PermissionDataAccess(components.dbManager);

    components.jsonService = new JsonService();
    components.jwtUtils = new JwtUtils(settings.authProviderSecret);

    components.permissionResource = new PermissionResource(components.permissionDataAccess);
    components.userResource = new UserResource(components.userDataAccess);
    components.stagingPhotoResource = new StagingPhotoResource();
    components.photoMovementResource = new PhotoMovementResource();
    components.wolResource = new WolResource(settings.macAddressLookup);

    components.middleware = {
        errorHandler: errorHandler,
        corsConfig: corsConfig,

        bodyParser: jsonBodyParser,
        tokenParser: getBearerTokenParser(components.jwtUtils),
        userUpdater: getUserUpdater(
            components.userDataAccess,
            components.jsonService,
            settings.authServer),

        unsecuredRouteGenerators: [
            routingMiddleware.getPermissionRouteGenerator(components.permissionResource)
        ],

        authorizationChecker: authorizationChecker,

        securedRouteGenerators: [
            routingMiddleware.getUserRouteGenerator(components.permissionDataAccess, components.userResource),
            routingMiddleware.getStagingPhotoRouteGenerator(components.permissionDataAccess, components.stagingPhotoResource),
            routingMiddleware.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource),
            routingMiddleware.getWolRouteGenerator(components.permissionDataAccess, components.wolResource)
        ]
    };

    return components;
}
