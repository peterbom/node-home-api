import Application from "koa";
import winston from "winston";
import winstonLogglyBulk from "winston-loggly-bulk";
import {default as DbManager} from "monk";

// Shared components
import {Log} from "./shared/log";
import {JsonService} from "./shared/json-service";
import {JwtUtils} from "./shared/jwt-utils";

// Services
import {FileFinder} from "./services/file-finder";
import {FileServices} from "./services/file-services";
import {ExifTool} from "./services/exif-tool";
import {UserDataAccess} from "./services/user-data-access";
import {PermissionDataAccess} from "./services/permission-data-access";
import {PhotoImageDataAccess} from "./services/photo-image-data-access";
import {PhotoIndexServices} from "./services/photo-index-services";
import {PhotoDuplicateServices} from "./services/photo-duplicate-services";
import {PhotoExifDataServices} from "./services/photo-exif-data-services";
import {PhotoImageServices} from "./services/photo-image-services";
import {PhotoMovementServices} from "./services/photo-movement-services";

// API Resources
import {PermissionResource} from "./resources/permission-resource";
import {UserResource} from "./resources/user-resource";
import {PhotoIndexResource} from "./resources/photo-index-resource";
import {PhotoDuplicateResource} from "./resources/photo-duplicate-resource";
import {PhotoExifDataResource} from "./resources/photo-exif-data-resource";
import {PhotoImageResource} from "./resources/photo-image-resource";
import {PhotoMovementResource} from "./resources/photo-movement-resource";
import {FileResource} from "./resources/file-resource";
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
        logglySubdomain: process.env.LOGGLY_SUBDOMAIN,
        logglyToken: process.env.LOGGLY_TOKEN,
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

    if (!settings.isUnitTest) {
        winston.add(winston.transports.Loggly, {
            token: settings.logglyToken,
            subdomain: settings.logglySubdomain,
            tags: ["home-api", process.env.NODE_ENV],
            json: true
        });
    }

    components.logger = winston;

    components.dbManager = new DbManager(settings.connectionString);

    components.fileFinder = new FileFinder();
    components.fileServices = new FileServices();
    components.exifTool = new ExifTool();
    components.userDataAccess = new UserDataAccess(components.dbManager);
    components.permissionDataAccess = new PermissionDataAccess(components.dbManager);
    components.photoImageDataAccess = new PhotoImageDataAccess(components.dbManager);
    components.photoIndexServices = new PhotoIndexServices(
        components.exifTool,
        components.photoImageDataAccess,
        components.fileFinder,
        [settings.stagingPhotoPath, settings.targetPhotoPath]);
    components.photoDuplicateServices = new PhotoDuplicateServices(
        components.exifTool,
        components.photoImageDataAccess);
    components.photoExifDataServices = new PhotoExifDataServices(
        components.exifTool,
        components.photoImageDataAccess);
    components.photoImageServices = new PhotoImageServices(components.photoImageDataAccess);
    components.photoMovementServices = new PhotoMovementServices(
        components.photoImageDataAccess,
        components.fileServices,
        settings.stagingPhotoPath,
        settings.targetPhotoPath);

    components.jsonService = new JsonService();
    components.jwtUtils = new JwtUtils(settings.authProviderSecret);

    components.permissionResource = new PermissionResource(components.permissionDataAccess);
    components.userResource = new UserResource(components.userDataAccess);
    components.photoIndexResource = new PhotoIndexResource(components.photoIndexServices);
    components.photoDuplicateResource = new PhotoDuplicateResource(components.photoDuplicateServices);
    components.photoExifDataResource = new PhotoExifDataResource(components.photoExifDataServices);
    components.photoImageResource = new PhotoImageResource(components.photoImageServices);
    components.photoMovementResource = new PhotoMovementResource(components.photoMovementServices);
    components.fileResource = new FileResource(components.fileServices);
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
            routing.getPhotoIndexRouteGenerator(components.permissionDataAccess, components.photoIndexResource),
            routing.getPhotoDuplicateRouteGenerator(components.permissionDataAccess, components.photoDuplicateResource),
            routing.getPhotoExifDataRouteGenerator(components.permissionDataAccess, components.photoExifDataResource),
            routing.getPhotoImageRouteGenerator(components.permissionDataAccess, components.photoImageResource),
            routing.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource),
            routing.getFileRouteGenerator(components.permissionDataAccess, components.fileResource),
            routing.getMachineStatusRouteGenerator(components.permissionDataAccess, components.machineStatusResource)
        ]
    };

    return components;
}
