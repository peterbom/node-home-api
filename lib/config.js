"use strict";

exports.__esModule = true;
exports.getDefaultComponents = getDefaultComponents;

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _monk = require("monk");

var _monk2 = _interopRequireDefault(_monk);

var _jsonService = require("./shared/json-service");

var _jwtUtils = require("./shared/jwt-utils");

var _fileFinder = require("./data-access/file-finder");

var _userDataAccess = require("./data-access/user-data-access");

var _permissionDataAccess = require("./data-access/permission-data-access");

var _stagingPhotoDataAccess = require("./data-access/staging-photo-data-access");

var _permissionResource = require("./resources/permission-resource");

var _userResource = require("./resources/user-resource");

var _stagingPhotoResource = require("./resources/staging-photo-resource");

var _photoMovementResource = require("./resources/photo-movement-resource");

var _machineStatusResource = require("./resources/machine-status-resource");

var _nullMiddleware = require("./middleware/null-middleware");

var _errorHandlingMiddleware = require("./middleware/error-handling-middleware");

var _corsMiddleware = require("./middleware/cors-middleware");

var _bodyParsingMiddleware = require("./middleware/body-parsing-middleware");

var _userUpdateMiddleware = require("./middleware/user-update-middleware");

var _tokenParsingMiddleware = require("./middleware/token-parsing-middleware");

var _authorizationMiddleware = require("./middleware/authorization-middleware");

var _routingMiddleware = require("./middleware/routing-middleware");

var routingMiddleware = _interopRequireWildcard(_routingMiddleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Middleware
function getDefaultSettings() {
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
        }
    };
}

// API Resources


// Data access


// Shared components
function getDefaultComponents() {
    var settings = getDefaultSettings();

    var components = {
        appSettings: settings
    };

    components.app = new _koa2.default();

    components.dbManager = new _monk2.default(settings.connectionString);

    components.fileFinder = new _fileFinder.FileFinder();
    components.userDataAccess = new _userDataAccess.UserDataAccess(components.dbManager);
    components.permissionDataAccess = new _permissionDataAccess.PermissionDataAccess(components.dbManager);
    components.stagingPhotoDataAccess = new _stagingPhotoDataAccess.StagingPhotoDataAccess(components.fileFinder);

    components.jsonService = new _jsonService.JsonService();
    components.jwtUtils = new _jwtUtils.JwtUtils(settings.authProviderSecret);

    components.permissionResource = new _permissionResource.PermissionResource(components.permissionDataAccess);
    components.userResource = new _userResource.UserResource(components.userDataAccess);
    components.stagingPhotoResource = new _stagingPhotoResource.StagingPhotoResource(components.stagingPhotoDataAccess);
    components.photoMovementResource = new _photoMovementResource.PhotoMovementResource();
    components.machineStatusResource = new _machineStatusResource.MachineStatusResource(settings.machineLookup);

    components.middleware = {
        errorHandler: _errorHandlingMiddleware.errorHandler,
        corsConfig: _corsMiddleware.corsConfig,

        bodyParser: _bodyParsingMiddleware.jsonBodyParser,
        tokenParser: (0, _tokenParsingMiddleware.getBearerTokenParser)(components.jwtUtils),
        userUpdater: (0, _userUpdateMiddleware.getUserUpdater)(components.userDataAccess, components.jsonService, settings.authServer),

        unsecuredRouteGenerators: [routingMiddleware.getPermissionRouteGenerator(components.permissionResource)],

        authorizationChecker: _authorizationMiddleware.authorizationChecker,

        securedRouteGenerators: [routingMiddleware.getUserRouteGenerator(components.permissionDataAccess, components.userResource), routingMiddleware.getStagingPhotoRouteGenerator(components.permissionDataAccess, components.stagingPhotoResource), routingMiddleware.getPhotoMovementRouteGenerator(components.permissionDataAccess, components.photoMovementResource), routingMiddleware.getMachineStatusRouteGenerator(components.permissionDataAccess, components.machineStatusResource)]
    };

    return components;
}