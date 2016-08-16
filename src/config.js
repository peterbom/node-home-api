import Application from "koa";

// Shared components
import {JwtParser} from "./oidc/jwt-parser";
import {JwtValidator} from "./oidc/jwt-validator";
import {HttpClientJsonService} from "./oidc/http-client-json-service";
import {AuthProviderManager} from "./oidc/auth-provider-manager";
import {IdTokenValidator} from "./oidc/id-token-validator";
import {PermissionManager} from "./authorization/permission-manager";
import {JwtSigner} from "./authorization/jwt-signer";

// Data access
import {OdbcDatabase} from "./data-access/odbc-database";
import {UserDataAccess} from "./data-access/user-data-access";
import {ConstructionStyleDataAccess as PackagingConstructionStyleDataAccess} from "./data-access/packaging/construction-style-data-access";

// API Resources
import {AuthenticationResource} from "./resources/authentication-resource";
import {UserResource} from "./resources/user-resource";
import {StagingPhotoResource} from "./resources/staging-photo-resource";
import {PhotoMovementResource} from "./resources/photo-movement-resource";
import {WolResource} from "./resources/wol-resource";
import {ConstructionStyleResource as PackagingConstructionStyleResource} from "./resources/packaging/construction-style-resource";

// Middleware
import {noop} from "./middleware/null-middleware";
import {errorHandler} from "./middleware/error-handling-middleware";
import {corsConfig} from "./middleware/cors-middleware";
import {jsonBodyParser} from "./middleware/body-parsing-middleware";
import {getBearerTokenParser} from "./middleware/token-parsing-middleware";
import {authorizationChecker} from "./middleware/authorization-middleware";
import * as routingMiddleware from "./middleware/routing-middleware";

export function getDefaultComponents (settings) {
    let components = {
        appSettings: settings
    };

    components.app = new Application();

    components.jwtParser = new JwtParser();
    components.jwtValidator = new JwtValidator(components.jwtParser);
    components.jsonService = new HttpClientJsonService();
    components.authProviderManager = new AuthProviderManager(settings.authSettings, components.jsonService);
    components.idTokenValidator = new IdTokenValidator(
        components.authProviderManager,
        components.jwtParser,
        components.jwtValidator);

    components.permissionManager = new PermissionManager();
    components.jwtSigner = new JwtSigner(settings.jwtSecret);

    components.packagingDatabaseFactory = () => new OdbcDatabase(settings.packagingConnectionString);

    components.userDataAccess = new UserDataAccess();
    components.packagingConstructionStyleDataAccess = new PackagingConstructionStyleDataAccess(
        components.packagingDatabaseFactory);

    components.authenticationResource = new AuthenticationResource(
        components.authProviderManager,
        components.idTokenValidator,
        components.jwtParser,
        components.permissionManager,
        components.jwtSigner);

    components.userResource = new UserResource(components.userDataAccess);
    components.stagingPhotoResource = new StagingPhotoResource();
    components.photoMovementResource = new PhotoMovementResource();
    components.wolResource = new WolResource(settings.macAddressLookup);

    components.packagingConstructionStyleResource = new PackagingConstructionStyleResource(
        components.packagingConstructionStyleDataAccess);

    components.middleware = {
        errorHandler: errorHandler,
        corsConfig: corsConfig,

        bodyParser: jsonBodyParser,
        tokenParser: getBearerTokenParser(settings.jwtSecret),

        unsecuredRouteGenerators: [
            routingMiddleware.getAuthenticationRouteGenerator(components.authenticationResource)
        ],

        authorizationChecker: authorizationChecker,

        securedRouteGenerators: [
            routingMiddleware.getUserRouteGenerator(components.userResource),
            routingMiddleware.getStagingPhotoRouteGenerator(components.stagingPhotoResource),
            routingMiddleware.getPhotoMovementRouteGenerator(components.photoMovementResource),
            routingMiddleware.getWolRouteGenerator(components.wolResource),
            routingMiddleware.getPackagingConstructionStyleRouteGenerator(components.packagingConstructionStyleResource)
        ]
    };

    return components;
}

export function getTestComponents() {
    let settings = getDefaultSettings();
    settings.isUnitTest = true;

    return getDefaultComponents(settings);
}

export function getDefaultSettings () {
    return {
        isUnitTest: false,
        port: process.env.PORT,
        packagingConnectionString: `Driver={SQL Server Native Client 11.0};Server=tcp:bombers.database.windows.net,1433;Database=Packaging;Uid=petebomber@bombers;Pwd=${process.env.PACKAGING_LOGIN_PASSWORD};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`,
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
