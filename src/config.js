const Application = require("koa");
const winston = require("winston");
const winstonLogglyBulk = require("winston-loggly-bulk");
const DbManager = require("monk");

// Shared components
const Log = require("./shared/log").Log;
const ImageUtils = require("./shared/image-utils").ImageUtils;
const JsonService = require("./shared/json-service").JsonService;
const JwtUtils = require("./shared/jwt-utils").JwtUtils;

// Services
const FileServices = require("./services/file-services").FileServices;
const SshServices = require("./services/ssh-services");

const UserDataAccess = require("./services/user-data-access").UserDataAccess;
const PhotoImageDataAccess = require("./services/photo-image-data-access").PhotoImageDataAccess;
const PhotoUploadDataAccess = require("./services/photo-upload-data-access").PhotoUploadDataAccess;
const PlantDataAccess = require("./services/plant-data-access").PlantDataAccess;
const PlantCompanionDataAccess = require("./services/plant-companion-data-access").PlantCompanionDataAccess;
const PlantReferenceDataAccess = require("./services/plant-reference-data-access").PlantReferenceDataAccess;

const PhotoImageServices = require("./services/photo-image-services").PhotoImageServices;
const PhotoMovementServices = require("./services/photo-movement-services").PhotoMovementServices;
const PhotoUploadServices = require("./services/photo-upload-services").PhotoUploadServices;
const PhotoFrameServices = require("./services/photo-frame-services").PhotoFrameServices;

// API Resources
const PermissionResource = require("./resources/permission-resource").PermissionResource;
const UserResource = require("./resources/user-resource").UserResource;
const PhotoImageResource = require("./resources/photo-image-resource").PhotoImageResource;
const PhotoMovementResource = require("./resources/photo-movement-resource").PhotoMovementResource;
const PhotoUploadResource = require("./resources/photo-upload-resource").PhotoUploadResource;
const PhotoFrameResource = require("./resources/photo-frame-resource").PhotoFrameResource;
const FileResource = require("./resources/file-resource").FileResource;
const MachineStatusResource = require("./resources/machine-status-resource").MachineStatusResource;
const PlantResource = require("./resources/plant-resource").PlantResource;
const PlantCompanionResource = require("./resources/plant-companion-resource").PlantCompanionResource;
const PlantReferenceResource = require("./resources/plant-reference-resource").PlantReferenceResource;

// Middleware
const noop = require("./middleware/null-middleware").noop;
const errorHandler = require("./middleware/error-handling-middleware").errorHandler;
const corsConfig = require("./middleware/cors-middleware").corsConfig;
const jsonBodyParser = require("./middleware/body-parsing-middleware").jsonBodyParser;
const userUpdater = require("./middleware/user-update-middleware").userUpdater;
const bearerTokenParser = require("./middleware/token-parsing-middleware").bearerTokenParser;
const authorizationChecker = require("./middleware/authorization-middleware").authorizationChecker;

// Routing
const routing = require("./app-routing");

exports.getDefaultComponents = (settings) => {
    let components = {};

    components.app = new Application();

    if (settings.logExternal) {
        winston.add(winston.transports.Loggly, {
            token: settings.logglyToken,
            subdomain: settings.logglySubdomain,
            tags: ["home-api", settings.nodeEnv],
            json: true
        });
    }

    components.logger = settings.logExternal ? winston : console;

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
    components.jwtUtils = new JwtUtils(settings.authJwksUrl, settings.authAudience, settings.authIssuer, null);

    components.fileServices = new FileServices();
    components.sshServices = new SshServices(
        settings.sshHost,
        settings.sshPort,
        settings.sshUsername,
        settings.sshPrivateKeyPath,
        settings.localRoot,
        settings.serverRoot);

    components.userDataAccess = new UserDataAccess(components.dbManager);
    components.photoImageDataAccess = new PhotoImageDataAccess(components.dbManager, components.imageUtils);
    components.photoUploadDataAccess = new PhotoUploadDataAccess(components.dbManager);
    components.plantDataAccess = new PlantDataAccess(components.dbManager);
    components.plantCompanionDataAccess = new PlantCompanionDataAccess(components.dbManager);
    components.plantReferenceDataAccess = new PlantReferenceDataAccess(components.dbManager);

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

    components.permissionResource = new PermissionResource();
    components.userResource = new UserResource(components.userDataAccess);
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
        tokenParser: bearerTokenParser,
        userUpdater: userUpdater,

        unsecuredRouteGenerators: [
            routing.permissionRouteGenerator,
            routing.plantViewRouteGenerator
        ],

        authorizationChecker: authorizationChecker,

        securedRouteGenerators: [
            routing.userRouteGenerator,
            routing.photoImageRouteGenerator,
            routing.photoMovementRouteGenerator,
            routing.photoUploadRouteGenerator,
            routing.photoFrameRouteGenerator,
            routing.fileRouteGenerator,
            routing.machineStatusRouteGenerator,
            routing.plantMaintainRouteGenerator
        ]
    };

    return components;
}
