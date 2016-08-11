"use strict";

exports.__esModule = true;
exports.appSettings = exports.authProviderManager = exports.app = undefined;
exports.initialize = initialize;

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _errorHandlingMiddleware = require("./middleware/error-handling-middleware");

var _corsMiddleware = require("./middleware/cors-middleware");

var _bodyParsingMiddleware = require("./middleware/body-parsing-middleware");

var _tokenParsingMiddleware = require("./middleware/token-parsing-middleware");

var _routingMiddleware = require("./middleware/routing-middleware");

var routers = _interopRequireWildcard(_routingMiddleware);

var _authProviderManager = require("./oidc/auth-provider-manager");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = exports.app = void 0;
var authProviderManager = exports.authProviderManager = void 0;
var appSettings = exports.appSettings = void 0;

function initialize(settings) {

    // Set up exports first, in case they're used by subsequent initialization code
    exports.app = app = new _koa2.default();
    exports.appSettings = appSettings = settings;

    if (settings.allowHttpRequests) {
        exports.authProviderManager = authProviderManager = new _authProviderManager.AuthProviderManager(settings.authSettings);
    } else {
        if (settings.jsonServiceFactory) {
            exports.authProviderManager = authProviderManager = new _authProviderManager.AuthProviderManager(settings.authSettings, settings.jsonServiceFactory);
        }
    }

    if (settings.middleware.errorHandler) {
        app.use(_errorHandlingMiddleware.errorHandler);
    }

    if (settings.middleware.corsConfig) {
        app.use(_corsMiddleware.corsConfig);
    }

    if (settings.middleware.bodyParser) {
        app.use(_bodyParsingMiddleware.jsonBodyParser);
    }

    if (settings.middleware.unsecuredRoutes) {
        app.use(routers.authenticationRouter);
    }

    if (settings.middleware.requireBearerToken) {
        app.use(_tokenParsingMiddleware.bearerTokenParser);
    }

    if (settings.middleware.securedRoutes) {
        app.use(routers.userRouter);
        app.use(routers.stagingPhotoRouter);
        app.use(routers.photoMovementRouter);

        // for (let router of routers.packagingRouters) {
        //     console.log("ROUTER>>>>>>>>>>>>>>>>>>>>>>>>>>> " + router);
        //     app.use(router);
        // }
        routers.packagingRouters.forEach(function (r) {
            return app.use(r);
        });
    }

    if (!settings.isUnitTest) {
        app.listen(settings.port);
        console.log("Application started. Listening on port: " + settings.port);
    }
}