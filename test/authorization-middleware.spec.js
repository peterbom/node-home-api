const Log = require("../src/shared/log").Log;
const supertest = require("supertest");
const timekeeper = require("timekeeper");

const MockUserDataAccess = require("./mocks/mock-user-data-access").MockUserDataAccess;
const MockJsonService = require("./mocks/mock-json-service").MockJsonService;
const {configureMockJsonService, createIdToken} = require("./utils/token-utils");

const getDefaultComponents = require("../src/config").getDefaultComponents;
const AppLauncher = require("../src/app-launcher").AppLauncher;
const RouteGenerator = require("../src/shared/route-generator").RouteGenerator;
const UserResource = require("../src/resources/user-resource").UserResource;

let settings = {
    connectionString: "mongodb://fakeuser:fakepassword@fakedomain.com/fakedb",
    authServer: "test.auth.com",
    authJwksUrl: "https://test.auth.com/.well-known/jwks.json",
    authAudience: "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA",
    authIssuer: "https://test.auth.com/",
    machineLookup: {
        test: {
            macAddress: "11:11:11:11:11:11"
        },
        flash: {
            ipAddress: "127.0.0.1"
        }
    },
};

let mockJwksJsonService = new MockJsonService();
configureMockJsonService(mockJwksJsonService, settings.authJwksUrl);

describe("Authorization middleware", function () {
    afterEach(() => timekeeper.reset());

    it ("returns unauthorized for secured resource when no access token is supplied", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents(settings);
        components.jsonService = mockJwksJsonService;
        components.userDataAccess = new MockUserDataAccess([{
            "sub": "user_1",
            "permissions": {"resource_access": true}
        }]);
        components.userResource = new UserResource(components.userDataAccess);
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "access")
        ];

        AppLauncher.launch(settings, components);
        let request = supertest.agent(components.app.listen());

        request
            .get("/secure-resource")
            .set("Accept", "application/json")
            .expect(function () {
                if (reachedSecureMiddleware) {
                    return "Reached secure middleware";
                }
            })
            .expect(401, done);
    });

    it ("returns unauthorized for secured resource when access token is expired", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents(settings);
        components.jsonService = mockJwksJsonService;
        components.userDataAccess = new MockUserDataAccess([{
            "sub": "user_1",
            "permissions": {"resource_access": true}
        }]);
        components.userResource = new UserResource(components.userDataAccess);
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "access")
        ];

        AppLauncher.launch(settings, components);
        let request = supertest.agent(components.app.listen());

        let token = createIdToken(components.jwtUtils, "user_1", new Date(2016, 1, 1), 1); // Valid for one minute

        let time = new Date(2016, 1, 1, 0, 2, 0); // 2 minutes later
        timekeeper.freeze(time);

        request
            .get("/secure-resource")
            .set("Accept", "application/json")
            .set("Authorization", `bearer ${token}`)
            .expect(function () {
                if (reachedSecureMiddleware) {
                    return "Reached secure middleware";
                }
            })
            .expect(401, done);
    });

    it ("returns forbidden for secured resource when access token lacks the required permissions", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents(settings);
        components.jsonService = mockJwksJsonService;
        components.userDataAccess = new MockUserDataAccess([{
            "sub": "user_1",
            "permissions": {"resource_read": true}
        }]);
        components.userResource = new UserResource(components.userDataAccess);
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "write")
        ];

        AppLauncher.launch(settings, components);
        let request = supertest.agent(components.app.listen());

        let token = createIdToken(components.jwtUtils, "user_1");

        request
            .get("/secure-resource")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(function () {
                if (reachedSecureMiddleware) {
                    return "Reached secure middleware";
                }
            })
            .expect(403, done);
    });

    it ("allows access to the route when access token has the required permissions", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents(settings);
        components.jsonService = mockJwksJsonService;
        components.userDataAccess = new MockUserDataAccess([{
            "sub": "user_1",
            "permissions": {"resource_write": true}
        }]);
        components.userResource = new UserResource(components.userDataAccess);
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "write")
        ];

        AppLauncher.launch(settings, components);
        let request = supertest.agent(components.app.listen());

        let token = createIdToken(components.jwtUtils, "user_1");

        request
            .get("/secure-resource")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(function () {
                if (!reachedSecureMiddleware) {
                    return "Failed to reach secure middleware";
                }
            })
            .expect(200, done);
    });
});