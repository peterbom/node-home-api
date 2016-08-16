import {RouteGenerator} from "../shared/route-generator";

export function getAuthenticationRouteGenerator (authenticationResource) {
    if (authenticationResource === undefined) {
        throw new Error("authenticationResource not defined");
    }

    return RouteGenerator.create()
        .get("/authentication", ctx => authenticationResource.getProviders(ctx))
        .post("/authentication", ctx => authenticationResource.authenticate(ctx));
}

export function getUserRouteGenerator (userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return RouteGenerator.create("experiment")
        .get("/user", ctx => userResource.list(ctx), "perform")
        .get('/user/:id', ctx => userResource.get(ctx), "perform")
        .post('/user', ctx => userResource.add(ctx), "perform")
        .put('/user/:id', ctx => userResource.update(ctx), "perform")
        .delete('/user/:id', ctx => userResource.remove(ctx), "perform");
}

export function getStagingPhotoRouteGenerator (stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return RouteGenerator.create("home")
        .get("/staging-photo", ctx => stagingPhotoResource.list(ctx), "manage")
        .get("/staging-photo/:id", ctx => stagingPhotoResource.get(ctx), "manage");
}

export function getPhotoMovementRouteGenerator (photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return RouteGenerator.create("home")
        .put("/photo-movement/:id", ctx => photoMovementResource.move(ctx), "manage");
}

export function getWolRouteGenerator (wolResource) {
    if (wolResource === undefined) {
        throw new Error("wolResource not defined");
    }

    return RouteGenerator.create("home")
        .put("/wol/:id", ctx => wolResource.send(ctx), "manage");
}

export function getPackagingConstructionStyleRouteGenerator (constructionStyleResource) {
    if (constructionStyleResource === undefined) {
        throw new Error("constructionStyleResource not defined");
    }

    return RouteGenerator.create("packaging")
        .get("/packaging/construction-style", ctx => constructionStyleResource.list(ctx), "maintain")
        .get("/packaging/construction-style/:id", ctx => constructionStyleResource.get(ctx), "maintain");
}
