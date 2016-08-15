"use strict";

exports.__esModule = true;
exports.getAuthenticationRouter = getAuthenticationRouter;
exports.getUserRouter = getUserRouter;
exports.getStagingPhotoRouter = getStagingPhotoRouter;
exports.getPhotoMovementRouter = getPhotoMovementRouter;
exports.getPackagingConstructionStyleRouter = getPackagingConstructionStyleRouter;

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAuthenticationRouter(authenticationResource) {
    if (authenticationResource === undefined) {
        throw new Error("authenticationResource not defined");
    }

    return (0, _koaSimpleRouter2.default)(function (_) {
        _.get("/authentication", function (ctx) {
            return authenticationResource.getProviders(ctx);
        });
        _.post("/authentication", function (ctx) {
            return authenticationResource.authenticate(ctx);
        });
    });
}

function getUserRouter(userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return (0, _koaSimpleRouter2.default)(function (_) {
        _.get("/user", function (ctx) {
            return userResource.list(ctx);
        });
        _.get('/user/:id', function (ctx) {
            return userResource.get(ctx);
        });
        _.post('/user', function (ctx) {
            return userResource.add(ctx);
        });
        _.put('/user/:id', function (ctx) {
            return userResource.update(ctx);
        });
        _.delete('/user/:id', function (ctx) {
            return userResource.remove(ctx);
        });
    });
}

function getStagingPhotoRouter(stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return (0, _koaSimpleRouter2.default)(function (_) {
        _.get("/staging-photo", function (ctx) {
            return stagingPhotoResource.list(ctx);
        });
        _.get("/staging-photo/:id", function (ctx) {
            return stagingPhotoResource.get(ctx);
        });
    });
}

function getPhotoMovementRouter(photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return (0, _koaSimpleRouter2.default)(function (_) {
        _.put("/photo-movement/:id", function (ctx) {
            return photoMovementResource.move(ctx);
        });
    });
}

function getPackagingConstructionStyleRouter(constructionStyleResource) {
    if (constructionStyleResource === undefined) {
        throw new Error("constructionStyleResource not defined");
    }

    return (0, _koaSimpleRouter2.default)(function (_) {
        _.get("/packaging/construction-style", function (ctx) {
            return constructionStyleResource.list(ctx);
        });
        _.get("/packaging/construction-style/:id", function (ctx) {
            return constructionStyleResource.get(ctx);
        });
    });
}