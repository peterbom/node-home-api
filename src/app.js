import "babel-polyfill";
import Application from "koa";

import {errorHandler} from "./error-handling-middleware";
import {jsonBodyParser} from "./request-processing-middleware";
import * as routers from "./routing-middleware";

export const app = new Application();

app.use(errorHandler);
app.use(jsonBodyParser);

app.use(routers.userRouter);
app.use(routers.stagingPhotoRouter);
app.use(routers.photoMovementRouter);

var port = process.env.PORT || (process.argv[2] || 3000);

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
    app.listen(port);
    console.log("Application started. Listening on port: " + port);
}
