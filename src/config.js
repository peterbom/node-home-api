import Application from "koa";
import winston from "winston";
import winstonLogglyBulk from "winston-loggly-bulk";
import {default as DbManager} from "monk";

// Shared components
import {Log} from "./shared/log";
import {ImageUtils} from "./shared/image-utils";
import {JsonService} from "./shared/json-service";
import {JwtUtils} from "./shared/jwt-utils";
const envVars = require("./shared/env-utils");

// Services
import {FileServices} from "./services/file-services";
const SshServices = require("./services/ssh-services");
import {ExifTool} from "./services/exif-tool";

import {UserDataAccess} from "./services/user-data-access";
import {PermissionDataAccess} from "./services/permission-data-access";
import {PhotoImageDataAccess} from "./services/photo-image-data-access";
import {PhotoUploadDataAccess} from "./services/photo-upload-data-access";
import {PlantDataAccess} from "./services/plant-data-access";
import {PlantCompanionDataAccess} from "./services/plant-companion-data-access";
import {PlantReferenceDataAccess} from "./services/plant-reference-data-access";

import {PhotoIndexServices} from "./services/photo-index-services";
import {PhotoDuplicateServices} from "./services/photo-duplicate-services";
import {PhotoExifDataServices} from "./services/photo-exif-data-services";
import {PhotoImageServices} from "./services/photo-image-services";
import {PhotoMovementServices} from "./services/photo-movement-services";
import {PhotoUploadServices} from "./services/photo-upload-services";
import {PhotoFrameServices} from "./services/photo-frame-services";

// API Resources
import {PermissionResource} from "./resources/permission-resource";
import {UserResource} from "./resources/user-resource";
import {PhotoIndexResource} from "./resources/photo-index-resource";
import {PhotoDuplicateResource} from "./resources/photo-duplicate-resource";
import {PhotoExifDataResource} from "./resources/photo-exif-data-resource";
import {PhotoImageResource} from "./resources/photo-image-resource";
import {PhotoMovementResource} from "./resources/photo-movement-resource";
import {PhotoUploadResource} from "./resources/photo-upload-resource";
import {PhotoFrameResource} from "./resources/photo-frame-resource";
import {FileResource} from "./resources/file-resource";
import {MachineStatusResource} from "./resources/machine-status-resource";
import {PlantResource} from "./resources/plant-resource";
import {PlantCompanionResource} from "./resources/plant-companion-resource";
import {PlantReferenceResource} from "./resources/plant-reference-resource";

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
        isUnitTest: envVars.nodeEnv === "test",
        port: envVars.port,
        logglySubdomain: envVars.logglySubdomain,
        logglyToken: envVars.logglyToken,
        authServer: envVars.authServer,
        authProviderSecret: envVars.authProviderSecret,
        connectionString: envVars.nodeEnv === "test" ? "localhost:27017/unitTest" : envVars.connectionString,
        suppressAuthorization: envVars.suppressAuthorization === "1" && envVars.nodeEnv === "development",
        machineLookup: {
            dev: {
                ipAddress: "192.168.1.200",
                macAddress: "bc:5f:f4:36:5c:a0"
            }, flash: {
                ipAddress: "192.168.1.100"
            }
        },
        stagingPhotoPath: envVars.stagingPhotoPath,
        targetPhotoPath: envVars.targetPhotoPath,
        sshHost: envVars.sshHost,
        sshPort: envVars.sshPort,
        sshUsername: envVars.sshUsername,
        sshPrivateKeyPath: envVars.sshPrivateKeyPath,
        localRoot: envVars.localRoot,
        serverRoot: envVars.serverRoot
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
            tags: ["home-api", envVars.nodeEnv],
            json: true
        });
    }

    components.logger = winston;

    components.dbManager = new DbManager(settings.connectionString);

    // The Monk API deprecates the static call to .id on monk instances
    // (which are really DbManagers). But to avoid passing another db-related
    // class around, we replace the instance method with the static method,
    // which isn't deprecated.
    components.dbManager.id = DbManager.id;
    components.dbManager.options = { 
        safe    : true,
        castIds : false
    };

    components.imageUtils = new ImageUtils(settings.targetPhotoPath);
    components.jsonService = new JsonService();
    components.jwtUtils = new JwtUtils(settings.authProviderSecret);

    components.fileServices = new FileServices();
    components.sshServices = new SshServices(
        settings.sshHost,
        settings.sshPort,
        settings.sshUsername,
        settings.sshPrivateKeyPath,
        settings.localRoot,
        settings.serverRoot);
    components.exifTool = new ExifTool();

    components.userDataAccess = new UserDataAccess(components.dbManager);
    components.permissionDataAccess = new PermissionDataAccess(components.dbManager);
    components.photoImageDataAccess = new PhotoImageDataAccess(components.dbManager, components.imageUtils);
    components.photoUploadDataAccess = new PhotoUploadDataAccess(components.dbManager);
    components.plantDataAccess = new PlantDataAccess(components.dbManager);
    components.plantCompanionDataAccess = new PlantCompanionDataAccess(components.dbManager);
    components.plantReferenceDataAccess = new PlantReferenceDataAccess(components.dbManager);

    components.photoIndexServices = new PhotoIndexServices(
        components.exifTool,
        components.photoImageDataAccess,
        components.fileServices,
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
        components.sshServices,
        components.imageUtils);
    components.photoUploadServices = new PhotoUploadServices(
        components.photoUploadDataAccess,
        settings.stagingPhotoPath);
    components.photoFrameServices = new PhotoFrameServices(
        components.photoImageDataAccess,
        settings.machineLookup.flash.ipAddress);

    components.permissionResource = new PermissionResource(components.permissionDataAccess);
    components.userResource = new UserResource(components.userDataAccess);
    components.photoIndexResource = new PhotoIndexResource(components.photoIndexServices);
    components.photoDuplicateResource = new PhotoDuplicateResource(components.photoDuplicateServices);
    components.photoExifDataResource = new PhotoExifDataResource(components.photoExifDataServices);
    components.photoImageResource = new PhotoImageResource(components.photoImageServices);
    components.photoMovementResource = new PhotoMovementResource(components.photoMovementServices);
    components.photoUploadResource = new PhotoUploadResource(components.photoUploadServices);
    components.photoFrameResource = new PhotoFrameResource(components.photoFrameServices);
    components.fileResource = new FileResource(components.fileServices);
    components.machineStatusResource = new MachineStatusResource(settings.machineLookup);
    components.plantResource = new PlantResource(components.plantDataAccess);
    components.plantCompanionResource = new PlantCompanionResource(components.plantCompanionDataAccess);
    components.plantReferenceResource = new PlantReferenceResource(components.plantReferenceDataAccess);

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
            routing.getPermissionRouteGenerator(components.permissionResource),
            routing.getPlantViewRouteGenerator(
                components.plantResource,
                components.plantCompanionResource,
                components.plantReferenceResource)
        ],

        authorizationChecker: authorizationChecker,

        securedRouteGenerators: [
            routing.getUserRouteGenerator(components.permissionDataAccess, components.userResource),
            routing.getPhotoIndexRouteGenerator(components.permissionDataAccess, components.photoIndexResource),
            routing.getPhotoDuplicateRouteGenerator(components.permissionDataAccess, components.photoDuplicateResource),
            routing.getPhotoExifDataRouteGenerator(components.permissionDataAccess, components.photoExifDataResource),
            routing.getPhotoImageRouteGenerator(components.permissionDataAccess, components.photoImageResource),
            routing.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource),
            routing.getPhotoUploadRouteGenerator(components.permissionDataAccess, components.photoUploadResource),
            routing.getPhotoFrameRouteGenerator(components.permissionDataAccess, components.photoFrameResource),
            routing.getFileRouteGenerator(components.permissionDataAccess, components.fileResource),
            routing.getMachineStatusRouteGenerator(components.permissionDataAccess, components.machineStatusResource),
            routing.getPlantMaintainRouteGenerator(
                components.permissionDataAccess,
                components.plantResource,
                components.plantCompanionResource,
                components.plantReferenceResource)
        ]
    };

    return components;
}
