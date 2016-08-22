"use strict";

exports.__esModule = true;
exports.getPermissionRouteGenerator = getPermissionRouteGenerator;
exports.getUserRouteGenerator = getUserRouteGenerator;
exports.getStagingPhotoRouteGenerator = getStagingPhotoRouteGenerator;
exports.getPhotoMovementRouteGenerator = getPhotoMovementRouteGenerator;
exports.getWolRouteGenerator = getWolRouteGenerator;

var _routeGenerator = require("../shared/route-generator");

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

function getWolRouteGenerator(permissionDataAccess, wolResource) {
    if (wolResource === undefined) {
        throw new Error("wolResource not defined");
    }

    return _routeGenerator.RouteGenerator.create(permissionDataAccess, "home").put("/wol/:id", function (ctx) {
        return wolResource.send(ctx);
    }, "manage");
}