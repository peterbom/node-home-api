import "babel-polyfill";

import supertest from "supertest";
import router from "koa-simple-router";

import {getUnitTestSettings} from "../lib/config";
import {initialize, app} from "../lib/globals";
import {errorHandler} from "../lib/middleware/error-handling-middleware";

let settings = getUnitTestSettings();
settings.middleware.errorHandler = false;
settings.middleware.corsConfig = false;
settings.middleware.bodyParser = false;
settings.middleware.requireBearerToken = false;
settings.middleware.unsecuredRoutes = false;
settings.middleware.securedRoutes = false;

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

        let syncThrowingRouter = router(_ => {
            _.get("/error-throwing-resource", syncThrowingFunction);
        });

        initialize(settings);
        app.use(catchAllMiddleware);
        app.use(syncThrowingRouter);

        let request = supertest.agent(app.listen());

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

        let asyncThrowingRouter = router(_ => {
            _.get("/error-throwing-resource", asyncThrowingFunction);
        });

        initialize(settings);
        app.use(catchAllMiddleware);
        app.use(asyncThrowingRouter);

        let request = supertest.agent(app.listen());

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

        initialize(settings);
        app.use(catchAllMiddleware);
        app.use(errorHandler);
        app.use(function (ctx, next) {
            syncThrowingFunction();
        });

        let request = supertest.agent(app.listen());

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

        initialize(settings);
        app.use(catchAllMiddleware);
        app.use(errorHandler);
        app.use(async function (ctx, next) {
            await asyncThrowingFunction();
        });

        let request = supertest.agent(app.listen());

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
