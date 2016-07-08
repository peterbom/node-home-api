var koa = require("koa");
var app = module.exports = koa();
var routes = require("koa-route");

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
var userRoutes = require("./userRoutes");
app.use(routes.get("/staging-photo", userRoutes.listStagingPhotos));
app.use(routes.get("/staging-photo/:id", userRoutes.getStagingPhoto));
app.use(routes.put("/photo-movement/:id", userRoutes.createPhotoMovement));

app.listen(3000);
console.log("The app is listening on port 3000");