"use strict";

exports.__esModule = true;
exports.getAuthenticationRouteGenerator = getAuthenticationRouteGenerator;
exports.getUserRouteGenerator = getUserRouteGenerator;
exports.getStagingPhotoRouteGenerator = getStagingPhotoRouteGenerator;
exports.getPhotoMovementRouteGenerator = getPhotoMovementRouteGenerator;
exports.getPackagingConstructionStyleRouteGenerator = getPackagingConstructionStyleRouteGenerator;

var _routeGenerator = require("../shared/route-generator");

function getAuthenticationRouteGenerator(authenticationResource) {
    if (authenticationResource === undefined) {
        throw new Error("authenticationResource not defined");
    }

    return _routeGenerator.RouteGenerator.create().get("/authentication", function (ctx) {
        return authenticationResource.getProviders(ctx);
    }).post("/authentication", function (ctx) {
        return authenticationResource.authenticate(ctx);
    });
}

function getUserRouteGenerator(userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return _routeGenerator.RouteGenerator.create("experiment").get("/user", function (ctx) {
        return userResource.list(ctx);
    }, "perform").get('/user/:id', function (ctx) {
        return userResource.get(ctx);
    }, "perform").post('/user', function (ctx) {
        return userResource.add(ctx);
    }, "perform").put('/user/:id', function (ctx) {
        return userResource.update(ctx);
    }, "perform").delete('/user/:id', function (ctx) {
        return userResource.remove(ctx);
    }, "perform");
}

function getStagingPhotoRouteGenerator(stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return _routeGenerator.RouteGenerator.create("home").get("/staging-photo", function (ctx) {
        return stagingPhotoResource.list(ctx);
    }, "manage").get("/staging-photo/:id", function (ctx) {
        return stagingPhotoResource.get(ctx);
    }, "manage");
}

function getPhotoMovementRouteGenerator(photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return _routeGenerator.RouteGenerator.create("home").put("/photo-movement/:id", function (ctx) {
        return photoMovementResource.move(ctx);
    }, "manage");
}

function getPackagingConstructionStyleRouteGenerator(constructionStyleResource) {
    if (constructionStyleResource === undefined) {
        throw new Error("constructionStyleResource not defined");
    }

    return _routeGenerator.RouteGenerator.create("packaging").get("/packaging/construction-style", function (ctx) {
        return constructionStyleResource.list(ctx);
    }, "maintain").get("/packaging/construction-style/:id", function (ctx) {
        return constructionStyleResource.get(ctx);
    }, "maintain");
}