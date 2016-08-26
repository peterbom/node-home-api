import "babel-polyfill";

import supertest from "supertest";

import {getDefaultComponents} from "../lib/config";
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

        let components = getDefaultComponents();
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

        let components = getDefaultComponents();
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