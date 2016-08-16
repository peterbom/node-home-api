"use strict";

exports.__esModule = true;
exports.getDefaultComponents = getDefaultComponents;
exports.getTestComponents = getTestComponents;
exports.getDefaultSettings = getDefaultSettings;

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _jwtParser = require("./oidc/jwt-parser");

var _jwtValidator = require("./oidc/jwt-validator");

var _httpClientJsonService = require("./oidc/http-client-json-service");

var _authProviderManager = require("./oidc/auth-provider-manager");

var _idTokenValidator = require("./oidc/id-token-validator");

var _permissionManager = require("./authorization/permission-manager");

var _jwtSigner = require("./authorization/jwt-signer");

var _odbcDatabase = require("./data-access/odbc-database");

var _userDataAccess = require("./data-access/user-data-access");

var _constructionStyleDataAccess = require("./data-access/packaging/construction-style-data-access");

var _authenticationResource = require("./resources/authentication-resource");

var _userResource = require("./resources/user-resource");

var _stagingPhotoResource = require("./resources/staging-photo-resource");

var _photoMovementResource = require("./resources/photo-movement-resource");

var _wolResource = require("./resources/wol-resource");

var _constructionStyleResource = require("./resources/packaging/construction-style-resource");

var _nullMiddleware = require("./middleware/null-middleware");

var _errorHandlingMiddleware = require("./middleware/error-handling-middleware");

var _corsMiddleware = require("./middleware/cors-middleware");

var _bodyParsingMiddleware = require("./middleware/body-parsing-middleware");

var _tokenParsingMiddleware = require("./middleware/token-parsing-middleware");

var _authorizationMiddleware = require("./middleware/authorization-middleware");

var _routingMiddleware = require("./middleware/routing-middleware");

var routingMiddleware = _interopRequireWildcard(_routingMiddleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Data access
function getDefaultComponents(settings) {
    var components = {
        appSettings: settings
    };

    components.app = new _koa2.default();

    components.jwtParser = new _jwtParser.JwtParser();
    components.jwtValidator = new _jwtValidator.JwtValidator(components.jwtParser);
    components.jsonService = new _httpClientJsonService.HttpClientJsonService();
    components.authProviderManager = new _authProviderManager.AuthProviderManager(settings.authSettings, components.jsonService);
    components.idTokenValidator = new _idTokenValidator.IdTokenValidator(components.authProviderManager, components.jwtParser, components.jwtValidator);

    components.permissionManager = new _permissionManager.PermissionManager();
    components.jwtSigner = new _jwtSigner.JwtSigner(settings.jwtSecret);

    components.packagingDatabaseFactory = function () {
        return new _odbcDatabase.OdbcDatabase(settings.packagingConnectionString);
    };

    components.userDataAccess = new _userDataAccess.UserDataAccess();
    components.packagingConstructionStyleDataAccess = new _constructionStyleDataAccess.ConstructionStyleDataAccess(components.packagingDatabaseFactory);

    components.authenticationResource = new _authenticationResource.AuthenticationResource(components.authProviderManager, components.idTokenValidator, components.jwtParser, components.permissionManager, components.jwtSigner);

    components.userResource = new _userResource.UserResource(components.userDataAccess);
    components.stagingPhotoResource = new _stagingPhotoResource.StagingPhotoResource();
    components.photoMovementResource = new _photoMovementResource.PhotoMovementResource();
    components.wolResource = new _wolResource.WolResource(settings.macAddressLookup);

    components.packagingConstructionStyleResource = new _constructionStyleResource.ConstructionStyleResource(components.packagingConstructionStyleDataAccess);

    components.middleware = {
        errorHandler: _errorHandlingMiddleware.errorHandler,
        corsConfig: _corsMiddleware.corsConfig,

        bodyParser: _bodyParsingMiddleware.jsonBodyParser,
        tokenParser: (0, _tokenParsingMiddleware.getBearerTokenParser)(settings.jwtSecret),

        unsecuredRouteGenerators: [routingMiddleware.getAuthenticationRouteGenerator(components.authenticationResource)],

        authorizationChecker: _authorizationMiddleware.authorizationChecker,

        securedRouteGenerators: [routingMiddleware.getUserRouteGenerator(components.userResource), routingMiddleware.getStagingPhotoRouteGenerator(components.stagingPhotoResource), routingMiddleware.getPhotoMovementRouteGenerator(components.photoMovementResource), routingMiddleware.getWolRouteGenerator(components.wolResource), routingMiddleware.getPackagingConstructionStyleRouteGenerator(components.packagingConstructionStyleResource)]
    };

    return components;
}

// Middleware


// API Resources


// Shared components
function getTestComponents() {
    var settings = getDefaultSettings();
    settings.isUnitTest = true;

    return getDefaultComponents(settings);
}

function getDefaultSettings() {
    return {
        isUnitTest: false,
        port: process.env.PORT,
        packagingConnectionString: "Driver={SQL Server Native Client 11.0};Server=tcp:bombers.database.windows.net,1433;Database=Packaging;Uid=petebomber@bombers;Pwd=" + process.env.PACKAGING_LOGIN_PASSWORD + ";Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;",
        authSettings: {
            "outlook": {
                authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
                client_id: "00000000-0000-0000-0000-00004C16745D"
            },
            "google": {
                authority: "https://accounts.google.com",
                client_id: "12212475530-pr5ug20eogvcicaggqk2bu0cr6bggspj.apps.googleusercontent.com"
            }
        },
        jwtSecret: process.env.JWT_SECRET,
        suppressAuthorization: process.env.SUPPRESS_AUTHORIZATION === "1" && process.env.NODE_ENV === "development",
        macAddressLookup: {
            dev: "bc:5f:f4:36:5c:a0"
        }
    };
}