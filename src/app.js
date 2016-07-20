import "babel-polyfill";
import Application from "koa";
import convert from "koa-convert";
import router from "koa-simple-router";
import bodyParser from "koa-bodyparser";

export const app = new Application();

// https://github.com/koajs/koa/wiki/Error-Handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
  	// https://developer.mozilla.org/en-US/docs/Web/API/Console/trace
  	console.trace(err);

    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
  }
});

// https://github.com/koajs/bodyparser
app.use(bodyParser({
	enableTypes: ["json"],
	// http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
	onerror: (err, ctx) => ctx.throw('invalid syntax', 400)
}));

let userRoutes = require("./userRoutes");
let userRouteMiddleware = router(_ => {
  _.get('/user/:id', userRoutes.get);
  _.post('/user', userRoutes.add);
  _.put('/user/:id', userRoutes.update);
  _.delete('/user/:id', userRoutes.remove);
});

app.use(userRouteMiddleware);

/*
// TODO: remove
//app.use(routes.post("/user", userRoutes.add));
app.use(routes.get("/user/:id", userRoutes.get));
//app.use(routes.put("/user/:id", userRoutes.update));
//app.use(routes.del("/user/:id", userRoutes.remove));
*/

/*
// Old:
// Get directories (from photoController.getPhotoPage)
// Get filenames in a given directory (from photoController.getPhotoPage)
// Get photo properties for a given directory (from photoController.getDirectoryData)
// Get photo tags for a given directory+filename (from photoController.getPhotoData)
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Get all staging photo file paths (GET /staging-photo)
// Get photo properties and tags for a given file path (GET /staging-photo/:id)
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
let photoRoutes = require("./photoRoutes");
app.use(routes.get("/staging-photo", photoRoutes.listStagingPhotos));
app.use(routes.get("/staging-photo/:id", photoRoutes.getStagingPhoto));
app.use(routes.put("/photo-movement/:id", photoRoutes.createPhotoMovement));
*/

var port = process.env.PORT || (process.argv[2] || 3000);

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
	app.listen(port);
	console.log("Application started. Listening on port: " + port);
}
