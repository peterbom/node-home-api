const Log = require("../src/shared/log").Log;
const supertest = require("supertest");
const timekeeper = require("timekeeper");

const MockPermissionDataAccess = require("./mocks/mock-permission-data-access").MockPermissionDataAccess;
const createIdToken = require("./utils/token-utils").createIdToken;

const getDefaultComponents = require("../src/config").getDefaultComponents;
const AppLauncher = require("../src/app-launcher").AppLauncher;
const RouteGenerator = require("../src/shared/route-generator").RouteGenerator;


describe("Authorization middleware", function () {

    it ("returns unauthorized for secured resource when no access token is supplied", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents();
        components.permissionDataAccess = new MockPermissionDataAccess({"user_1": ["resource_access"]});
        components.middleware.userUpdater = null;
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create(components.permissionDataAccess, "resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "access")
        ];

        AppLauncher.launch(components);
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

        let components = getDefaultComponents();
        components.permissionDataAccess = new MockPermissionDataAccess({"user_1": ["resource_access"]});
        components.middleware.userUpdater = null;
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create(components.permissionDataAccess, "resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "access")
        ];

        AppLauncher.launch(components);
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

        let components = getDefaultComponents();
        components.permissionDataAccess = new MockPermissionDataAccess({"user_1": ["resource_read"]});
        components.middleware.userUpdater = null;
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create(components.permissionDataAccess, "resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "write")
        ];

        AppLauncher.launch(components);
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
    })

    it ("allows access to the route when access token has the required permissions", done => {
        let reachedSecureMiddleware = false;

        let components = getDefaultComponents();
        components.permissionDataAccess = new MockPermissionDataAccess({"user_1": ["resource_write"]});
        components.middleware.userUpdater = null;
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create(components.permissionDataAccess, "resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "write")
        ];

        AppLauncher.launch(components);
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
    })
});