"use strict";

exports.__esModule = true;
exports.getPermissionRouteGenerator = getPermissionRouteGenerator;
exports.getUserRouteGenerator = getUserRouteGenerator;
exports.getPhotoIndexRouteGenerator = getPhotoIndexRouteGenerator;
exports.getPhotoDuplicateRouteGenerator = getPhotoDuplicateRouteGenerator;
exports.getPhotoExifDataRouteGenerator = getPhotoExifDataRouteGenerator;
exports.getPhotoImageRouteGenerator = getPhotoImageRouteGenerator;
exports.getPhotoMovementRouteGenerator = getPhotoMovementRouteGenerator;
exports.getPhotoUploadRouteGenerator = getPhotoUploadRouteGenerator;
exports.getFileRouteGenerator = getFileRouteGenerator;
exports.getMachineStatusRouteGenerator = getMachineStatusRouteGenerator;

var _log = require("./shared/log");

var _routeGenerator = require("./shared/route-generator");

function getPermissionRouteGenerator(permissionResource) {
    if (permissionResource === undefined) {
        throw new Error("permissionResource not defined");
    }

    return _routeGenerator.RouteGenerator.create().get("/permission", function (ctx) {
        return permissionResource.getPermissions(ctx);
    });
}

function getUserRouteGenerator(permissionDataAccess, userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "site").get("/user", function (ctx) {
        return userResource.list(ctx);
    }, "maintain").get('/user/:id', function (ctx) {
        return userResource.get(ctx);
    }, "maintain").post('/user', function (ctx) {
        return userResource.add(ctx);
    }, "maintain").put('/user/:id', function (ctx) {
        return userResource.update(ctx);
    }, "maintain").delete('/user/:id', function (ctx) {
        return userResource.remove(ctx);
    }, "maintain");
}

function getPhotoIndexRouteGenerator(permissionDataAccess, photoIndexResource) {
    if (photoIndexResource === undefined) {
        throw new Error("photoIndexResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-index", function (ctx) {
        return photoIndexResource.compare(ctx);
    }, "manage").post("/photo-index", function (ctx) {
        return photoIndexResource.apply(ctx);
    }, "manage");
}

function getPhotoDuplicateRouteGenerator(permissionDataAccess, photoDuplicateResource) {
    if (photoDuplicateResource === undefined) {
        throw new Error("photoDuplicateResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-duplicate", function (ctx) {
        return photoDuplicateResource.list(ctx);
    }, "manage").get("/photo-duplicate/:id", function (ctx) {
        return photoDuplicateResource.get(ctx);
    }, "manage").post("/photo-duplicate", function (ctx) {
        return photoDuplicateResource.resolve(ctx);
    }, "manage");
}

function getPhotoExifDataRouteGenerator(permissionDataAccess, photoExifDataResource) {
    if (photoExifDataResource === undefined) {
        throw new Error("photoExifDataResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-exif-data", function (ctx) {
        return photoExifDataResource.query(ctx);
    }, "manage").get("/photo-exif-data/:id", function (ctx) {
        return photoExifDataResource.get(ctx);
    }, "manage").post("/photo-exif-data", function (ctx) {
        return photoExifDataResource.updateMany(ctx);
    }, "manage");
}

function getPhotoImageRouteGenerator(permissionDataAccess, photoImageResource) {
    if (photoImageResource === undefined) {
        throw new Error("photoImageResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-image/:id", function (ctx) {
        return photoImageResource.getById(ctx);
    }, "manage").get("/photo-image", function (ctx) {
        return photoImageResource.query(ctx);
    }, "manage");
}

function getPhotoMovementRouteGenerator(permissionDataAccess, photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-movement", function (ctx) {
        return photoMovementResource.getAll(ctx);
    }, "manage").get("/photo-movement/:path", function (ctx) {
        return photoMovementResource.getByDirectoryPath(ctx);
    }, "manage").put("/photo-movement/:id", function (ctx) {
        return photoMovementResource.move(ctx);
    }, "manage");
}

function getPhotoUploadRouteGenerator(permissionDataAccess, photoUploadResource) {
    if (photoUploadResource === undefined) {
        throw new Error("photoUploadResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").post("/photo-upload", function (ctx) {
        return photoUploadResource.create(ctx);
    }, "manage").put("/photo-upload/:uploadId/:filename", function (ctx) {
        return photoUploadResource.addFile(ctx);
    }, "manage");
}

function getFileRouteGenerator(permissionDataAccess, fileResource) {
    if (fileResource === undefined) {
        throw new Error("fileResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").delete("/file", function (ctx) {
        return fileResource.deleteCriteria(ctx);
    }, "manage").delete("/file/:filePath", function (ctx) {
        return fileResource.deleteFilePath(ctx);
    }, "manage");
}

function getMachineStatusRouteGenerator(permissionDataAccess, machineStatusResource) {
    if (machineStatusResource === undefined) {
        throw new Error("machineStatusResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/machine-status/:id", function (ctx) {
        return machineStatusResource.query(ctx);
    }, "manage").put("/machine-status/:id", function (ctx) {
        return machineStatusResource.request(ctx);
    }, "manage");
}