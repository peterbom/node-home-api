
/*
// Old:
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
*/

export class PhotoMovementResource {
    async move(ctx) {
        ctx.status = 201;
    }
}
