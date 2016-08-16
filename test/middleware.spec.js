import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

import {getTestComponents} from "../lib/config";
import {AppLauncher} from "../lib/app-launcher";
import {RouteGenerator} from "../lib/shared/route-generator";


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

describe("Router middleware", function () {

    it ("propagates synchronous route-handler errors", done => {

        let components = getTestComponents();
        components.middleware.errorHandler = null;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRouteGenerators = [
            RouteGenerator.create().get("/error-throwing-resource", syncThrowingFunction)
        ];
        components.middleware.securedRouteGenerators = [];

        // Add the catch-all middleware before anything else
        components.app.use(catchAllMiddleware);
        AppLauncher.launch(components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/error-throwing-resource")
            .expect(function () {
                let issues = [];
                if (!errorBubbledUp) {
                    issues.push("Error failed to bubble up to previous middleware");
                }

                if (!middlewareCompleted) {
                    issues.push("Request completed without middleware completing");
                }

                return issues.join(";");
            })
            .expect(500, done);
    });

    it ("propagates asynchronous route-handler errors", done => {

        let components = getTestComponents();
        components.middleware.errorHandler = null;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRouteGenerators = [
            RouteGenerator.create().get("/error-throwing-resource", asyncThrowingFunction)
        ];
        components.middleware.securedRouteGenerators = [];

        // Add the catch-all middleware before anything else
        components.app.use(catchAllMiddleware);
        AppLauncher.launch(components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/error-throwing-resource")
            .expect(function () {
                let issues = [];
                if (!errorBubbledUp) {
                    issues.push("Error failed to bubble up to previous middleware");
                }

                if (!middlewareCompleted) {
                    issues.push("Request completed without middleware completing");
                }

                return issues.join(";");
            })
            .expect(500, done);
    });
});

describe("Authorization middleware", function () {

    it ("returns unauthorized for secured resource when no access token is supplied", done => {
        let reachedSecureMiddleware = false;

        let components = getTestComponents();
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
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

        let components = getTestComponents();
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "access")
        ];

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

        let user = {
            email: "test@email.com",
            name: "Test User",
            permissions: ["resource_access"]
        };

        let time = new Date(2016, 1, 1);
        timekeeper.freeze(time);

        let token = components.jwtSigner.signJwt(user, 1); // Valid for one minute

        time = new Date(2016, 1, 1, 0, 0, 2); // 2 minutes later
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

        let components = getTestComponents();
        components.middleware.unsecuredRouteGenerators = [];
        components.middleware.securedRouteGenerators = [
            RouteGenerator.create("resource")
                .get("/secure-resource", ctx => {
                    reachedSecureMiddleware = true;
                    ctx.body = {success: true};
                }, "write")
        ];

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

        let user = {
            email: "test@email.com",
            name: "Test User",
            permissions: ["resource_read"]
        };

        let time = new Date(2016, 1, 1);
        timekeeper.freeze(time);

        let token = components.jwtSigner.signJwt(user, 1);
    
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
});

describe("Error handling middleware", function () {

    it ("catches synchronous errors", done => {

        let components = getTestComponents();
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRouteGenerators = [
            RouteGenerator.create().get("/error-throwing-resource", syncThrowingFunction)
        ];
        components.middleware.securedRouteGenerators = [];

        // Add the catch-all middleware before anything else
        components.app.use(catchAllMiddleware);
        AppLauncher.launch(components);

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

        let components = getTestComponents();
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
        AppLauncher.launch(components);

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
