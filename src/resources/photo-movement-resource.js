const Log = require("../shared/log").Log;

/*
// Old:
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
*/

class PhotoMovementResource {
    constructor(photoMovementServices) {
        this._photoMovementServices = photoMovementServices;
    }

    async getAll(ctx) {
        ctx.body = await this._photoMovementServices.getDirectoryPathsForMovement();
    }

    async getByDirectoryPath(ctx) {
        let directoryPath = ctx.params.path;
        ctx.body = await this._photoMovementServices.getImagesToMove(directoryPath);
    }

    async move(ctx) {
        let id = ctx.params.id;
        await this._photoMovementServices.moveImageFile(id);
        ctx.status = 200;
    }
}

exports.PhotoMovementResource = PhotoMovementResource;