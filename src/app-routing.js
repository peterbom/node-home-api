import {Log} from "./shared/log";
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

export function getPhotoDuplicateRouteGenerator (permissionDataAccess, photoDuplicateResource) {
    if (photoDuplicateResource === undefined) {
        throw new Error("photoDuplicateResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-duplicate", ctx => photoDuplicateResource.list(ctx), "manage")
        .get("/photo-duplicate/:id", ctx => photoDuplicateResource.get(ctx), "manage");
}

export function getPhotoExifDataRouteGenerator(permissionDataAccess, photoExifDataResource) {
    if (photoExifDataResource === undefined) {
        throw new Error("photoExifDataResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-exif-data", ctx => photoExifDataResource.query(ctx), "manage")
        .get("/photo-exif-data/:id", ctx => photoExifDataResource.get(ctx), "manage");
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
