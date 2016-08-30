"use strict";

exports.__esModule = true;
exports.getPermissionRouteGenerator = getPermissionRouteGenerator;
exports.getUserRouteGenerator = getUserRouteGenerator;
exports.getPhotoDirectoryRouteGenerator = getPhotoDirectoryRouteGenerator;
exports.getStagingPhotoRouteGenerator = getStagingPhotoRouteGenerator;
exports.getPhotoMovementRouteGenerator = getPhotoMovementRouteGenerator;
exports.getMachineStatusRouteGenerator = getMachineStatusRouteGenerator;

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

function getPhotoDirectoryRouteGenerator(permissionDataAccess, photoDirectoryResource) {
    if (photoDirectoryResource === undefined) {
        throw new Error("photoDirectoryResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/photo-directory", function (ctx) {
        return photoDirectoryResource.list(ctx);
    }, "manage").put("/photo-directory/:id", function (ctx) {
        return photoDirectoryResource.update(ctx);
    }, "manage");
}

function getStagingPhotoRouteGenerator(permissionDataAccess, stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").get("/staging-photo", function (ctx) {
        return stagingPhotoResource.list(ctx);
    }, "manage").get("/staging-photo/:id", function (ctx) {
        return stagingPhotoResource.get(ctx);
    }, "manage");
}

function getPhotoMovementRouteGenerator(permissionDataAccess, photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").put("/photo-movement/:id", function (ctx) {
        return photoMovementResource.move(ctx);
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