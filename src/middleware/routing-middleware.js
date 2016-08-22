import {RouteGenerator} from "../shared/route-generator";

export function getPermissionRouteGenerator(permissionResource) {
    if (permissionResource === undefined) {
        throw new Error("permissionResource not defined");
    }

    return RouteGenerator.create()
        .get("/permission", ctx => permissionResource.getPermissions(ctx));
}

export function getUserRouteGenerator (permissionDataAccess, userResource) {
    if (userResource === undefined) {
        throw new Error("userResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "site")
        .get("/user", ctx => userResource.list(ctx), "maintain")
        .get('/user/:id', ctx => userResource.get(ctx), "maintain")
        .post('/user', ctx => userResource.add(ctx), "maintain")
        .put('/user/:id', ctx => userResource.update(ctx), "maintain")
        .delete('/user/:id', ctx => userResource.remove(ctx), "maintain");
}

export function getStagingPhotoRouteGenerator (permissionDataAccess, stagingPhotoResource) {
    if (stagingPhotoResource === undefined) {
        throw new Error("stagingPhotoResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/staging-photo", ctx => stagingPhotoResource.list(ctx), "manage")
        .get("/staging-photo/:id", ctx => stagingPhotoResource.get(ctx), "manage");
}

export function getPhotoMovementRouteGenerator (permissionDataAccess, photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .put("/photo-movement/:id", ctx => photoMovementResource.move(ctx), "manage");
}

export function getWolRouteGenerator (permissionDataAccess, wolResource) {
    if (wolResource === undefined) {
        throw new Error("wolResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .put("/wol/:id", ctx => wolResource.send(ctx), "manage");
}
