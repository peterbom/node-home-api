const Log = require("./shared/log").Log;
const RouteGenerator = require("./shared/route-generator").RouteGenerator;

exports.getPermissionRouteGenerator = permissionResource => {
    if (permissionResource === undefined) {
        throw new Error("permissionResource not defined");
    }

    return RouteGenerator.create()
        .get("/permission", ctx => permissionResource.getPermissions(ctx));
};

exports.getUserRouteGenerator = (userResource) => {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return RouteGenerator.create("site")
        .get("/user", ctx => userResource.list(ctx), "maintain")
        .get('/user/:id', ctx => userResource.get(ctx), "maintain")
        .post('/user', ctx => userResource.add(ctx), "maintain")
        .put('/user/:id', ctx => userResource.update(ctx), "maintain")
        .delete('/user/:id', ctx => userResource.remove(ctx), "maintain");
};

exports.getAzureSasTokenRouteGenerator = (azureSasTokenResource) => {
    if (azureSasTokenResource === undefined) {
        throw new Error("azureSasTokenResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/azure-sas-token", ctx => azureSasTokenResource.getToken(ctx), "manage");
};

exports.getPhotoIndexRouteGenerator = (photoIndexResource) => {
    if (photoIndexResource === undefined) {
        throw new Error("photoIndexResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-index", ctx => photoIndexResource.listDirectories(ctx), "manage")
        .get("/photo-index/:path", ctx => photoIndexResource.compare(ctx), "manage")
        .post("/photo-index", ctx => photoIndexResource.apply(ctx), "manage");
};

exports.getPhotoDuplicateRouteGenerator = (photoDuplicateResource) => {
    if (photoDuplicateResource === undefined) {
        throw new Error("photoDuplicateResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-duplicate", ctx => photoDuplicateResource.list(ctx), "manage")
        .get("/photo-duplicate/:id", ctx => photoDuplicateResource.get(ctx), "manage")
        .post("/photo-duplicate", ctx => photoDuplicateResource.resolve(ctx), "manage");
};

exports.getPhotoExifDataRouteGenerator = (photoExifDataResource) => {
    if (photoExifDataResource === undefined) {
        throw new Error("photoExifDataResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-exif-data", ctx => photoExifDataResource.query(ctx), "manage")
        .get("/photo-exif-data/:id", ctx => photoExifDataResource.get(ctx), "manage")
        .post("/photo-exif-data", ctx => photoExifDataResource.updateMany(ctx), "manage");
};

exports.getPhotoImageRouteGenerator = (photoImageResource) => {
    if (photoImageResource === undefined) {
        throw new Error("photoImageResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-image/:id", ctx => photoImageResource.getById(ctx), "manage")
        .get("/photo-image", ctx => photoImageResource.query(ctx), "manage");
};

exports.getPhotoMovementRouteGenerator = (photoMovementResource) => {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-movement", ctx => photoMovementResource.getAll(ctx), "manage")
        .get("/photo-movement/:path", ctx => photoMovementResource.getByDirectoryPath(ctx), "manage")
        .put("/photo-movement/:id", ctx => photoMovementResource.move(ctx), "manage");
};

exports.getPhotoUploadRouteGenerator = (photoUploadResource) => {
    if (photoUploadResource === undefined) {
        throw new Error("photoUploadResource not defined");
    }

    return RouteGenerator.create("home")
        .post("/photo-upload", ctx => photoUploadResource.create(ctx), "manage")
        .put("/photo-upload/:uploadId/:filename", ctx => photoUploadResource.addFile(ctx), "manage");
};

exports.getPhotoFrameRouteGenerator = (photoFrameResource) => {
    if (photoFrameResource === undefined) {
        throw new Error("photoFrameResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/photo-frame", ctx => photoFrameResource.list(ctx), "manage")
        .post("/photo-frame", ctx => photoFrameResource.addImages(ctx), "manage")
        .delete("/photo-frame", ctx => photoFrameResource.clearImages(ctx), "manage");
};

exports.getFileRouteGenerator = (fileResource) => {
    if (fileResource === undefined) {
        throw new Error("fileResource not defined");
    }

    return RouteGenerator.create("home")
        .delete("/file", ctx => fileResource.deleteCriteria(ctx), "manage")
        .delete("/file/:filePath", ctx => fileResource.deleteFilePath(ctx), "manage");
};

exports.getMachineStatusRouteGenerator = (machineStatusResource) => {
    if (machineStatusResource === undefined) {
        throw new Error("machineStatusResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/machine-status/:id", ctx => machineStatusResource.query(ctx), "manage")
        .put("/machine-status/:id", ctx => machineStatusResource.request(ctx), "manage");
};

exports.getPlantViewRouteGenerator = (
    plantResource,
    plantCompanionResource,
    plantReferenceResource) => {

    if (plantResource === undefined) throw new Error("plantResource not defined");
    if (plantCompanionResource === undefined) throw new Error("plantCompanionResource not defined");
    if (plantReferenceResource === undefined) throw new Error("plantReferenceResource not defined");

    return RouteGenerator.create()
        .get("/plant", ctx => plantResource.listPlants(ctx))
        .get("/plant-link", ctx => plantResource.listLinks(ctx))
        .get("/plant-companion", ctx => plantCompanionResource.list(ctx))
        .get("/plant-reference/companion-help", ctx => plantReferenceResource.listCompanionHelp(ctx))
        .get("/plant-reference/companion-hinder", ctx => plantReferenceResource.listCompanionHinder(ctx));
};

exports.getPlantMaintainRouteGenerator = (
    plantResource,
    plantCompanionResource,
    plantReferenceResource) => {

    if (plantResource === undefined) throw new Error("plantResource not defined");
    if (plantCompanionResource === undefined) throw new Error("plantCompanionResource not defined");
    if (plantReferenceResource === undefined) throw new Error("plantReferenceResource not defined");

    return RouteGenerator.create("home")
        .put("/plant/:tsn", ctx => plantResource.set(ctx), "manage")
        .put("/plant-companion/:tsn", ctx => plantCompanionResource.set(ctx), "manage")
        .delete("/plant-companion/:tsn", ctx => plantCompanionResource.delete(ctx), "manage")
        .put("/plant-reference/companion-help/:tsn1/:tsn2", ctx => plantReferenceResource.addCompanionHelpReference(ctx), "manage")
        .put("/plant-reference/companion-hinder/:tsn1/:tsn2", ctx => plantReferenceResource.addCompanionHinderReference(ctx), "manage")
        .delete("/plant-reference/:id", ctx => plantReferenceResource.deleteReference(ctx), "manage");
}
