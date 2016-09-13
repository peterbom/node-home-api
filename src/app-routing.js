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

export function getPhotoIndexRouteGenerator (permissionDataAccess, photoIndexResource) {
    if (photoIndexResource === undefined) {
        throw new Error("photoIndexResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-index", ctx => photoIndexResource.compare(ctx), "manage")
        .post("/photo-index", ctx => photoIndexResource.apply(ctx), "manage");
}

export function getPhotoDuplicateRouteGenerator (permissionDataAccess, photoDuplicateResource) {
    if (photoDuplicateResource === undefined) {
        throw new Error("photoDuplicateResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-duplicate", ctx => photoDuplicateResource.list(ctx), "manage")
        .get("/photo-duplicate/:id", ctx => photoDuplicateResource.get(ctx), "manage")
        .post("/photo-duplicate", ctx => photoDuplicateResource.resolve(ctx), "manage");
}

export function getPhotoExifDataRouteGenerator(permissionDataAccess, photoExifDataResource) {
    if (photoExifDataResource === undefined) {
        throw new Error("photoExifDataResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-exif-data", ctx => photoExifDataResource.query(ctx), "manage")
        .get("/photo-exif-data/:id", ctx => photoExifDataResource.get(ctx), "manage")
        .post("/photo-exif-data", ctx => photoExifDataResource.updateMany(ctx), "manage");
}

export function getPhotoImageRouteGenerator(permissionDataAccess, photoImageResource) {
    if (photoImageResource === undefined) {
        throw new Error("photoImageResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-image/:id", ctx => photoImageResource.getById(ctx), "manage")
        .get("/photo-image", ctx => photoImageResource.query(ctx), "manage");
}

export function getPhotoMovementRouteGenerator (permissionDataAccess, photoMovementResource) {
    if (photoMovementResource === undefined) {
        throw new Error("photoMovementResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/photo-movement", ctx => photoMovementResource.getAll(ctx), "manage")
        .put("/photo-movement/:id", ctx => photoMovementResource.move(ctx), "manage");
}

export function getPhotoUploadRouteGenerator (permissionDataAccess, photoUploadResource) {
    if (photoUploadResource === undefined) {
        throw new Error("photoUploadResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .post("/photo-upload", ctx => photoUploadResource.create(ctx), "manage")
        .put("/photo-upload/:uploadId/:filename", ctx => photoUploadResource.addFile(ctx), "manage");
}

export function getFileRouteGenerator (permissionDataAccess, fileResource) {
    if (fileResource === undefined) {
        throw new Error("fileResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .delete("/file", ctx => fileResource.deleteCriteria(ctx), "manage")
        .delete("/file/:filePath", ctx => fileResource.deleteFilePath(ctx), "manage");
}

export function getMachineStatusRouteGenerator (permissionDataAccess, machineStatusResource) {
    if (machineStatusResource === undefined) {
        throw new Error("machineStatusResource not defined");
    }

    return RouteGenerator.create(permissionDataAccess, "home")
        .get("/machine-status/:id", ctx => machineStatusResource.query(ctx), "manage")
        .put("/machine-status/:id", ctx => machineStatusResource.request(ctx), "manage");
}
