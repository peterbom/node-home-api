export async function list(ctx) {
    ctx.body = [];
}

export async function get(ctx) {
    ctx.body = {};
}
/*
// Old:
// Get directories (from photoController.getPhotoPage)
// Get filenames in a given directory (from photoController.getPhotoPage)
// Get photo properties for a given directory (from photoController.getDirectoryData)
// Get photo tags for a given directory+filename (from photoController.getPhotoData)

// New:
// Get all staging photo file paths (GET /staging-photo)
// Get photo properties and tags for a given file path (GET /staging-photo/:id)
*/
