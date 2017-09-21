const Log = require("./shared/log").Log;
const RouteGenerator = require("./shared/route-generator").RouteGenerator;

exports.permissionRouteGenerator = RouteGenerator
    .create()
    .get("/permission", ctx => ctx.components.permissionResource.getPermissions(ctx));

exports.userRouteGenerator = RouteGenerator
    .create("site")
    .get("/user", ctx => ctx.components.userResource.list(ctx), "maintain")
    .get('/user/:id', ctx => ctx.components.userResource.get(ctx), "maintain")
    .post('/user', ctx => ctx.components.userResource.add(ctx), "maintain")
    .put('/user/:id', ctx => ctx.components.userResource.update(ctx), "maintain")
    .delete('/user/:id', ctx => ctx.components.userResource.remove(ctx), "maintain");

exports.photoIndexRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-index", ctx => ctx.components.photoIndexResource.listDirectories(ctx), "manage")
    .get("/photo-index/:path", ctx => ctx.components.photoIndexResource.compare(ctx), "manage")
    .post("/photo-index", ctx => ctx.components.photoIndexResource.apply(ctx), "manage");

exports.photoDuplicateRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-duplicate", ctx => ctx.components.photoDuplicateResource.list(ctx), "manage")
    .get("/photo-duplicate/:id", ctx => ctx.components.photoDuplicateResource.get(ctx), "manage")
    .post("/photo-duplicate", ctx => ctx.components.photoDuplicateResource.resolve(ctx), "manage");

exports.photoExifDataRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-exif-data", ctx => ctx.components.photoExifDataResource.query(ctx), "manage")
    .get("/photo-exif-data/:id", ctx => ctx.components.photoExifDataResource.get(ctx), "manage")
    .post("/photo-exif-data", ctx => ctx.components.photoExifDataResource.updateMany(ctx), "manage");

exports.photoImageRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-image/:id", ctx => ctx.components.photoImageResource.getById(ctx), "manage")
    .get("/photo-image", ctx => ctx.components.photoImageResource.query(ctx), "manage");

exports.photoMovementRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-movement", ctx => ctx.components.photoMovementResource.getAll(ctx), "manage")
    .get("/photo-movement/:path", ctx => ctx.components.photoMovementResource.getByDirectoryPath(ctx), "manage")
    .put("/photo-movement/:id", ctx => ctx.components.photoMovementResource.move(ctx), "manage");

exports.photoUploadRouteGenerator = RouteGenerator
    .create("home")
    .post("/photo-upload", ctx => ctx.components.photoUploadResource.create(ctx), "manage")
    .put("/photo-upload/:uploadId/:filename", ctx => ctx.components.photoUploadResource.addFile(ctx), "manage");

exports.photoFrameRouteGenerator = RouteGenerator
    .create("home")
    .get("/photo-frame", ctx => ctx.components.photoFrameResource.list(ctx), "manage")
    .post("/photo-frame", ctx => ctx.components.photoFrameResource.addImages(ctx), "manage")
    .delete("/photo-frame", ctx => ctx.components.photoFrameResource.clearImages(ctx), "manage");

exports.fileRouteGenerator = RouteGenerator
    .create("home")
    .delete("/file", ctx => ctx.components.fileResource.deleteCriteria(ctx), "manage")
    .delete("/file/:filePath", ctx => ctx.components.fileResource.deleteFilePath(ctx), "manage");

exports.machineStatusRouteGenerator = RouteGenerator
    .create("home")
    .get("/machine-status/:id", ctx => ctx.components.machineStatusResource.query(ctx), "manage")
    .put("/machine-status/:id", ctx => ctx.components.machineStatusResource.request(ctx), "manage");

exports.plantViewRouteGenerator = RouteGenerator
    .create()
    .get("/plant", ctx => ctx.components.plantResource.listPlants(ctx))
    .get("/plant-link", ctx => ctx.components.plantResource.listLinks(ctx))
    .get("/plant-companion", ctx => ctx.components.plantCompanionResource.list(ctx))
    .get("/plant-reference/companion-help", ctx => ctx.components.plantReferenceResource.listCompanionHelp(ctx))
    .get("/plant-reference/companion-hinder", ctx => ctx.components.plantReferenceResource.listCompanionHinder(ctx));

exports.plantMaintainRouteGenerator = RouteGenerator
    .create("home")
    .put("/plant/:tsn", ctx => ctx.components.plantResource.set(ctx), "manage")
    .put("/plant-companion/:tsn", ctx => ctx.components.plantCompanionResource.set(ctx), "manage")
    .delete("/plant-companion/:tsn", ctx => ctx.components.plantCompanionResource.delete(ctx), "manage")
    .put("/plant-reference/companion-help/:tsn1/:tsn2", ctx => ctx.components.plantReferenceResource.addCompanionHelpReference(ctx), "manage")
    .put("/plant-reference/companion-hinder/:tsn1/:tsn2", ctx => ctx.components.plantReferenceResource.addCompanionHinderReference(ctx), "manage")
    .delete("/plant-reference/:id", ctx => ctx.components.plantReferenceResource.deleteReference(ctx), "manage");
