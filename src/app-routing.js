import {RouteGenerator} from "./shared/route-generator";

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

export function getPhotoSyncRouteGenerator (permissionDataAccess, photoSyncResource) {
    if (photoSyncResource === undefined) {
        throw new Error("photoSyncResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-sync", ctx => photoSyncResource.compare(ctx), "manage")
        .put("/photo-sync/:id", ctx => photoSyncResource.update(ctx), "manage");
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

export function getMachineStatusRouteGenerator (permissionDataAccess, machineStatusResource) {
    if (machineStatusResource === undefined) {
        throw new Error("machineStatusResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/machine-status/:id", ctx => machineStatusResource.query(ctx), "manage")
        .put("/machine-status/:id", ctx => machineStatusResource.request(ctx), "manage");
}
