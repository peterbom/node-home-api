"use strict";

exports.__esModule = true;
exports.getDefaultComponents = getDefaultComponents;

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _winstonLogglyBulk = require("winston-loggly-bulk");

var _winstonLogglyBulk2 = _interopRequireDefault(_winstonLogglyBulk);

var _monk = require("monk");

var _monk2 = _interopRequireDefault(_monk);

var _log = require("./shared/log");

var _jsonService = require("./shared/json-service");

var _jwtUtils = require("./shared/jwt-utils");

var _fileFinder = require("./services/file-finder");

var _fileServices = require("./services/file-services");

var _exifTool = require("./services/exif-tool");

var _userDataAccess = require("./services/user-data-access");

var _permissionDataAccess = require("./services/permission-data-access");

var _photoImageDataAccess = require("./services/photo-image-data-access");

var _photoIndexServices = require("./services/photo-index-services");

var _photoDuplicateServices = require("./services/photo-duplicate-services");

var _photoExifDataServices = require("./services/photo-exif-data-services");

var _photoImageServices = require("./services/photo-image-services");

var _photoMovementServices = require("./services/photo-movement-services");

var _permissionResource = require("./resources/permission-resource");

var _userResource = require("./resources/user-resource");

var _photoIndexResource = require("./resources/photo-index-resource");

var _photoDuplicateResource = require("./resources/photo-duplicate-resource");

var _photoExifDataResource = require("./resources/photo-exif-data-resource");

var _photoImageResource = require("./resources/photo-image-resource");

var _photoMovementResource = require("./resources/photo-movement-resource");

var _fileResource = require("./resources/file-resource");

var _machineStatusResource = require("./resources/machine-status-resource");

var _nullMiddleware = require("./middleware/null-middleware");

var _errorHandlingMiddleware = require("./middleware/error-handling-middleware");

var _corsMiddleware = require("./middleware/cors-middleware");

var _bodyParsingMiddleware = require("./middleware/body-parsing-middleware");

var _userUpdateMiddleware = require("./middleware/user-update-middleware");

var _tokenParsingMiddleware = require("./middleware/token-parsing-middleware");

var _authorizationMiddleware = require("./middleware/authorization-middleware");

var _appRouting = require("./app-routing");

var routing = _interopRequireWildcard(_appRouting);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Middleware


// Services
function getDefaultSettings() {
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

// Routing


// API Resources


// Shared components
function getDefaultComponents() {
    var settings = getDefaultSettings();

    var components = {
        appSettings: settings
    };

    components.app = new _koa2.default();

    if (!settings.isUnitTest) {
        _winston2.default.add(_winston2.default.transports.Loggly, {
            token: settings.logglyToken,
            subdomain: settings.logglySubdomain,
            tags: ["home-api", process.env.NODE_ENV],
            json: true
        });
    }

    components.logger = _winston2.default;

    components.dbManager = new _monk2.default(settings.connectionString);

    components.fileFinder = new _fileFinder.FileFinder();
    components.fileServices = new _fileServices.FileServices();
    components.exifTool = new _exifTool.ExifTool();
    components.userDataAccess = new _userDataAccess.UserDataAccess(components.dbManager);
    components.permissionDataAccess = new _permissionDataAccess.PermissionDataAccess(components.dbManager);
    components.photoImageDataAccess = new _photoImageDataAccess.PhotoImageDataAccess(components.dbManager);
    components.photoIndexServices = new _photoIndexServices.PhotoIndexServices(components.exifTool, components.photoImageDataAccess, components.fileFinder, [settings.stagingPhotoPath, settings.targetPhotoPath]);
    components.photoDuplicateServices = new _photoDuplicateServices.PhotoDuplicateServices(components.exifTool, components.photoImageDataAccess);
    components.photoExifDataServices = new _photoExifDataServices.PhotoExifDataServices(components.exifTool, components.photoImageDataAccess);
    components.photoImageServices = new _photoImageServices.PhotoImageServices(components.photoImageDataAccess);
    components.photoMovementServices = new _photoMovementServices.PhotoMovementServices(components.photoImageDataAccess, components.fileServices, settings.stagingPhotoPath, settings.targetPhotoPath);

    components.jsonService = new _jsonService.JsonService();
    components.jwtUtils = new _jwtUtils.JwtUtils(settings.authProviderSecret);

    components.permissionResource = new _permissionResource.PermissionResource(components.permissionDataAccess);
    components.userResource = new _userResource.UserResource(components.userDataAccess);
    components.photoIndexResource = new _photoIndexResource.PhotoIndexResource(components.photoIndexServices);
    components.photoDuplicateResource = new _photoDuplicateResource.PhotoDuplicateResource(components.photoDuplicateServices);
    components.photoExifDataResource = new _photoExifDataResource.PhotoExifDataResource(components.photoExifDataServices);
    components.photoImageResource = new _photoImageResource.PhotoImageResource(components.photoImageServices);
    components.photoMovementResource = new _photoMovementResource.PhotoMovementResource(components.photoMovementServices);
    components.fileResource = new _fileResource.FileResource(components.fileServices);
    components.machineStatusResource = new _machineStatusResource.MachineStatusResource(settings.machineLookup);

    components.middleware = {
        errorHandler: _errorHandlingMiddleware.errorHandler,
        corsConfig: _corsMiddleware.corsConfig,

        bodyParser: _bodyParsingMiddleware.jsonBodyParser,
        tokenParser: (0, _tokenParsingMiddleware.getBearerTokenParser)(components.jwtUtils),
        userUpdater: (0, _userUpdateMiddleware.getUserUpdater)(components.userDataAccess, components.jsonService, settings.authServer),

        unsecuredRouteGenerators: [routing.getPermissionRouteGenerator(components.permissionResource)],

        authorizationChecker: _authorizationMiddleware.authorizationChecker,

        securedRouteGenerators: [routing.getUserRouteGenerator(components.permissionDataAccess, components.userResource), routing.getPhotoIndexRouteGenerator(components.permissionDataAccess, components.photoIndexResource), routing.getPhotoDuplicateRouteGenerator(components.permissionDataAccess, components.photoDuplicateResource), routing.getPhotoExifDataRouteGenerator(components.permissionDataAccess, components.photoExifDataResource), routing.getPhotoImageRouteGenerator(components.permissionDataAccess, components.photoImageResource), routing.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource), routing.getFileRouteGenerator(components.permissionDataAccess, components.fileResource), routing.getMachineStatusRouteGenerator(components.permissionDataAccess, components.machineStatusResource)]
    };

    return components;
}