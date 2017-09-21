const Log = require("../src/shared/log").Log;
const supertest = require("supertest");

const getDefaultComponents = require("../src/config").getDefaultComponents;
const AppLauncher = require("../src/app-launcher").AppLauncher;
const RouteGenerator = require("../src/shared/route-generator").RouteGenerator;

let delay = function () {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, 10);
    });
};

let syncThrowingFunction = function () {
    throw new Error("Test sync error");
};

let asyncThrowingFunction = async function () {
    await delay();
    throw new Error("Test async error");
};

let errorBubbledUp = false;
let middlewareCompleted = false;
let catchAllMiddleware = async function (ctx, next) {
    try {
        errorBubbledUp = false;
        middlewareCompleted = false;
        await next();
        middlewareCompleted = true;
    } catch (err) {
        errorBubbledUp = true;
        ctx.status = 500;
    }
}

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

describe("Error handling middleware", function () {

    it ("catches synchronous errors", done => {

        let components = getDefaultComponents(settings);
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRouteGenerators = [
            RouteGenerator.create().get("/error-throwing-resource", syncThrowingFunction)
        ];
        components.middleware.securedRouteGenerators = [];

        // Add the catch-all middleware before anything else
        components.app.use(catchAllMiddleware);
        AppLauncher.launch(settings, components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/error-throwing-resource")
            .expect(function () {
                let issues = [];
                if (errorBubbledUp) {
                    issues.push("Error handling middleware allowed error to bubble up to previous middleware");
                }

                if (!middlewareCompleted) {
                    issues.push("Request completed without middleware completing");
                }

                return issues.join(";");
            })
            .expect(500, done);
    });

    it ("catches asynchronous errors", done => {

        let components = getDefaultComponents(settings);
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRouteGenerators = [
            RouteGenerator.create()
                .get("/error-throwing-resource", async function (ctx, next) {
                    await asyncThrowingFunction();
                })
        ];
        components.middleware.securedRouteGenerators = [];

        // Add the catch-all middleware before anything else
        components.app.use(catchAllMiddleware);
        AppLauncher.launch(settings, components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/error-throwing-resource")
            .expect(function () {
                let issues = [];
                if (errorBubbledUp) {
                    issues.push("Error handling middleware allowed error to bubble up to previous middleware");
                }

                if (!middlewareCompleted) {
                    issues.push("Request completed without middleware completing");
                }

                return issues.join(";");
            })
            .expect(500, done);
    });
});
