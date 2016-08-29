import Application from "koa";
import {default as DbManager} from "monk";

// Shared components
import {JsonService} from "./shared/json-service";
import {JwtUtils} from "./shared/jwt-utils";

// Data access
import {FileFinder} from "./data-access/file-finder";
import {ExifTool} from "./data-access/exif-tool";
import {UserDataAccess} from "./data-access/user-data-access";
import {PermissionDataAccess} from "./data-access/permission-data-access";
import {ImageDataAccess} from "./data-access/image-data-access";
import {PhotoDirectoryDataAccess} from "./data-access/photo-directory-data-access";
import {StagingPhotoDataAccess} from "./data-access/staging-photo-data-access";

// API Resources
import {PermissionResource} from "./resources/permission-resource";
import {UserResource} from "./resources/user-resource";
import {PhotoDirectoryResource} from "./resources/photo-directory-resource";
import {StagingPhotoResource} from "./resources/staging-photo-resource";
import {PhotoMovementResource} from "./resources/photo-movement-resource";
import {MachineStatusResource} from "./resources/machine-status-resource";

// Middleware
import {noop} from "./middleware/null-middleware";
import {errorHandler} from "./middleware/error-handling-middleware";
import {corsConfig} from "./middleware/cors-middleware";
import {jsonBodyParser} from "./middleware/body-parsing-middleware";
import {getUserUpdater} from "./middleware/user-update-middleware";
import {getBearerTokenParser} from "./middleware/token-parsing-middleware";
import {authorizationChecker} from "./middleware/authorization-middleware";

// Routing
import * as routing from "./app-routing";

function getDefaultSettings () {
    return {
        isUnitTest: process.env.NODE_ENV === "test",
        port: process.env.PORT,
        authServer: process.env.AUTH_SERVER,
        authProviderSecret: process.env.AUTH_PROVIDER_SECRET,
        connectionString: process.env.NODE_ENV === "test" ? "localhost:27017/unitTest" : process.env.CONNECTION_STRING,
        suppressAuthorization: process.env.SUPPRESS_AUTHORIZATION === "1" && process.env.NODE_ENV === "development",
        machineLookup: {
            dev: {
                ipAddress: "192.168.1.200",
                macAddress: "bc:5f:f4:36:5c:a0"
            }
        },
        stagingPhotoPath: process.env.STAGING_PHOTO_PATH,
        targetPhotoPath: process.env.TARGET_PHOTO_PATH
    };
}

export function getDefaultComponents () {
    let settings = getDefaultSettings();
    
    let components = {
        appSettings: settings
    };

    components.app = new Application();

    components.dbManager = new DbManager(settings.connectionString);

    components.fileFinder = new FileFinder();
    components.exifTool = new ExifTool();
    components.userDataAccess = new UserDataAccess(components.dbManager);
    components.permissionDataAccess = new PermissionDataAccess(components.dbManager);
    components.imageDataAccess = new ImageDataAccess(components.dbManager);
    components.photoDirectoryDataAccess = new PhotoDirectoryDataAccess(
        components.fileFinder,
        [settings.stagingPhotoPath, settings.targetPhotoPath]);
    components.stagingPhotoDataAccess = new StagingPhotoDataAccess(
        components.exifTool,
        components.imageDataAccess,
        components.fileFinder,
        settings.stagingPhotoPath);

    components.jsonService = new JsonService();
    components.jwtUtils = new JwtUtils(settings.authProviderSecret);

    components.permissionResource = new PermissionResource(components.permissionDataAccess);
    components.userResource = new UserResource(components.userDataAccess);
    components.photoDirectoryResource = new PhotoDirectoryResource(components.photoDirectoryDataAccess);
    components.stagingPhotoResource = new StagingPhotoResource(components.stagingPhotoDataAccess);
    components.photoMovementResource = new PhotoMovementResource();
    components.machineStatusResource = new MachineStatusResource(settings.machineLookup);

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
            routing.getPermissionRouteGenerator(components.permissionResource)
        ],

        authorizationChecker: authorizationChecker,

        securedRouteGenerators: [
            routing.getUserRouteGenerator(components.permissionDataAccess, components.userResource),
            routing.getPhotoDirectoryRouteGenerator(components.permissionDataAccess, components.photoDirectoryResource),
            routing.getStagingPhotoRouteGenerator(components.permissionDataAccess, components.stagingPhotoResource),
            routing.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource),
            routing.getMachineStatusRouteGenerator(components.permissionDataAccess, components.machineStatusResource)
        ]
    };

    return components;
}
