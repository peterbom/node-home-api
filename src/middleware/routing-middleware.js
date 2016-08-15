import router from "koa-simple-router";

export function getAuthenticationRouter (authenticationResource) {
    if (authenticationResource === undefined) {
        throw new Error("authenticationResource not defined");
    }

    return router(_ => {
        _.get("/authentication", ctx => authenticationResource.getProviders(ctx));
        _.post("/authentication", ctx => authenticationResource.authenticate(ctx));
    });
}

export function getUserRouter (userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return router(_ => {
        _.get("/user", ctx => userResource.list(ctx));
        _.get('/user/:id', ctx => userResource.get(ctx));
        _.post('/user', ctx => userResource.add(ctx));
        _.put('/user/:id', ctx => userResource.update(ctx));
        _.delete('/user/:id', ctx => userResource.remove(ctx));
    });
}

export function getStagingPhotoRouter (stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return router(_ => {
        _.get("/staging-photo", ctx => stagingPhotoResource.list(ctx));
        _.get("/staging-photo/:id", ctx => stagingPhotoResource.get(ctx));
    });
}

export function getPhotoMovementRouter (photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return router(_ => {
        _.put("/photo-movement/:id", ctx => photoMovementResource.move(ctx));
    });
}

export function getPackagingConstructionStyleRouter (constructionStyleResource) {
    if (constructionStyleResource === undefined) {
        throw new Error("constructionStyleResource not defined");
    }

    return router(_ => {
        _.get("/packaging/construction-style", ctx => constructionStyleResource.list(ctx));
        _.get("/packaging/construction-style/:id", ctx => constructionStyleResource.get(ctx));
    });
}
