import "babel-polyfill";

import supertest from "supertest";
import router from "koa-simple-router";

import {getTestComponents} from "../lib/config";
import {AppLauncher} from "../lib/app-launcher";
import {errorHandler} from "../lib/middleware/error-handling-middleware";



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
        components.middleware.errorHandler = catchAllMiddleware;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRoutes = [
            router(_ => {
                _.get("/error-throwing-resource", syncThrowingFunction);
            })
        ];
        components.middleware.securedRoutes = [];

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
        components.middleware.errorHandler = catchAllMiddleware;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRoutes = [
            router(_ => {
                _.get("/error-throwing-resource", asyncThrowingFunction);
            })
        ];
        components.middleware.securedRoutes = [];

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

describe("Error handling middleware", function () {

    it ("catches synchronous errors", done => {

        let components = getTestComponents();
        components.middleware.errorHandler = null;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRoutes = [
            catchAllMiddleware,
            errorHandler,
            function (ctx, next) {
                syncThrowingFunction();
            }
        ];
        components.middleware.securedRoutes = [];

        AppLauncher.launch(components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/")
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
        components.middleware.errorHandler = null;
        components.middleware.corsConfig = null;
        components.middleware.bodyParser = null;
        components.middleware.requireBearerToken = null;
        components.middleware.unsecuredRoutes = [
            catchAllMiddleware,
            errorHandler,
            async function (ctx, next) {
                await asyncThrowingFunction();
            }
        ];
        components.middleware.securedRoutes = [];

        AppLauncher.launch(components);

        let request = supertest.agent(components.app.listen());

        request
            .get("/")
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
