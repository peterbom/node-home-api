import "babel-polyfill";
import Application from "koa";
import {createAuthProviderManager} from "./authentication-config";

import {errorHandler} from "./middleware/error-handling-middleware";
import {corsConfig} from "./middleware/cors-middleware";
import {jsonBodyParser} from "./middleware/body-parsing-middleware";
import {bearerTokenParser} from "./middleware/token-parsing-middleware";
import * as routers from "./middleware/routing-middleware";

export const app = new Application();
export const authProviderManager = createAuthProviderManager();

app.use(errorHandler);
app.use(corsConfig);
app.use(jsonBodyParser);

// Routes which don't require a bearer token
app.use(routers.authenticationRouter);

app.use(bearerTokenParser);

// Routes which require a bearer token
app.use(routers.userRouter);
app.use(routers.stagingPhotoRouter);
app.use(routers.photoMovementRouter);

var port = process.env.PORT || (process.argv[2] || 3000);

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
    app.listen(port);
    console.log("Application started. Listening on port: " + port);
}
