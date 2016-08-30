import path from "path";

export class StagingPhotoDataAccess {
    constructor (exifTool, imageDataAccess, fileFinder, stagingPhotoPath) {
        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    async getAllFiles () {
        let files = await this._fileFinder.findFiles(
            [this._stagingPhotoPath],
            [/(?!.*\/)?@.*/, /.*\.db/],
            /^(?!.*\.db$)/);

        let directories = [];
        let directoryLookup = {};
        let updatePromises = [];
        files.forEach(file => {
            let directory = directoryLookup[file.path];

            if (!directory) {
                directory = {
                    path: file.path,
                    files: []
                };

                directories.push(directory);
                directoryLookup[file.path] = directory;
            }

            directory.files.push({
                filename: file.filename,
                ino: file.ino
            });

            updatePromises.push(this._imageDataAccess.upsertLocation(file.ino, file.path, file.filename));
        });

        await Promise.all(updatePromises);

        return directories;
    }

    async isKnownImageFile(inode) {
        return await this._imageDataAccess.hasImage(inode);
    }

    async getImageInfo(inode) {
        let image = await this._imageDataAccess.findImage(inode);
        let filePath = path.join(image.path, image.filename);

        if (!image.imageData) {
            image.imageData = await this._exifTool.getImageData(filePath);
        }

        if (!image.tags) {
            image.tags = await this._exifTool.getTags(filePath);
        }

        await this._imageDataAccess.upsertImage(inode, image.path, image.filename, image.imageData, image.tags);

        return Object.assign({}, image.imageData, image.tags);
    }
}