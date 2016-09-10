import {Log} from "../shared/log";

/*
// Old:
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
*/

export class PhotoMovementResource {
    constructor(photoMovementServices) {
        this._photoMovementServices = photoMovementServices;
    }

    async getAll(ctx) {
        ctx.body = await this._photoMovementServices.getAllImagesForMovement();
    }

    async move(ctx) {
        let id = ctx.params.id;
        await this._photoMovementServices.moveImageFile(id);
        ctx.status = 200;
    }
}