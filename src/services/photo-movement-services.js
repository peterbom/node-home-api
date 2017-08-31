const Log = require("../shared/log").Log;
const path = require("path");

class PhotoMovementServices {
    constructor (photoImageDataAccess, fileServices, sshServices, imageUtils) {
        this._photoImageDataAccess = photoImageDataAccess;
        this._sshServices = sshServices;
        this._fileServices = fileServices;
        this._imageUtils = imageUtils;
    }

    async getDirectoryPathsForMovement() {
        return await this._photoImageDataAccess.findPathsRequiringMovement();
    }

    async getImagesToMove(directoryPath) {
        // Pre-load all duplicate hashes
        let duplicateHashes = new Set(await this._photoImageDataAccess.listDuplicateHashes());

        let images = await this._photoImageDataAccess.findImagesRequiringMovement(directoryPath);

        let results = [];
        let promises = [];
        for (let image of images) {
            let destinationDirectoryPath = this._imageUtils.getDestinationDirectoryPath(image.properties);
            let destinationFilename = this._imageUtils.getDestinationFilename(image.properties, image.filename);

            if (destinationDirectoryPath !== image.directoryPath ||
                destinationFilename !== image.filename) {
                let result = {
                    id: image._id,
                    hash: image.hash,
                    current: {
                        directoryPath: image.directoryPath,
                        filename: image.filename
                    },
                    destination: {
                        directoryPath: destinationDirectoryPath,
                        filename: destinationFilename
                    },
                    hasDuplicate: duplicateHashes.has(image.hash)
                };

                results.push(result);

                // Check whether a file already exists at the destination path
                let existenceCheck = async () => {
                    result.fileExists = await this._fileServices.exists(
                        path.join(destinationDirectoryPath, destinationFilename));
                };

                promises.push(existenceCheck());
            }
        }

        await Promise.all(promises);

        return results;
    }

    async moveImageFile (id) {
        let image = await this._photoImageDataAccess.getById(id);

        let destinationDirectoryPath = this._imageUtils.getDestinationDirectoryPath(image.properties);
        let destinationFilename = this._imageUtils.getDestinationFilename(image.properties, image.filename);

        let currentPath = path.join(image.directoryPath, image.filename);
        let targetPath = path.join(destinationDirectoryPath, destinationFilename);

        await this._sshServices.moveServerFiles(currentPath, targetPath);
        await this._photoImageDataAccess.updateLocation(id, destinationDirectoryPath, destinationFilename);
    }
}

exports.PhotoMovementServices = PhotoMovementServices;