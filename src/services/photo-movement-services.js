import {Log} from "../shared/log";
import path from "path";
import moment from "moment";

export class PhotoMovementServices {
    constructor (photoImageDataAccess, fileServices, stagingPhotoPath, targetPhotoPath) {
        this._photoImageDataAccess = photoImageDataAccess;
        this._fileServices = fileServices;
        this._stagingPhotoPath = stagingPhotoPath;
        this._targetPhotoPath = targetPhotoPath;
    }

    async getAllImagesForMovement() {
        // Get all image IDs
        let allIds = await this._photoImageDataAccess.getIds();

        // Pre-load all duplicate hashes
        let duplicateHashes = await this._photoImageDataAccess.listDuplicateHashes();
        let duplicateHashLookup = {};
        duplicateHashes.forEach(h => duplicateHashLookup[h] = true);

        // Process these in batches to avoid loading an excessive number of images at once
        let batches = [];
        while (allIds.length) {
            batches.push(allIds.splice(0, 100));
        }

        let results = [];
        for (let batch of batches) {
            // Include invalid (i.e. avoid filtering on validity, since we already did that)
            let images = await this._photoImageDataAccess.getByIds(batch, true);

            let promises = [];
            for (let image of images) {
                let destinationDirectoryPath = getDestinationDirectoryPath(image, this._targetPhotoPath);
                let destinationFilename = getDestinationFilename(image);

                if (destinationDirectoryPath !== image.directoryPath ||
                    destinationFilename !== image.filename) {
                    let result = {
                        id: image._id,
                        current: {
                            directoryPath: image.directoryPath,
                            filename: image.filename
                        },
                        destination: {
                            directoryPath: destinationDirectoryPath,
                            filename: destinationFilename
                        },
                        hasDuplicate: !!duplicateHashLookup[image.hash]
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
        }

        return results;
    }

    async moveImageFile (id) {
        let image = await this._photoImageDataAccess.getById(id);

        let destinationDirectoryPath = getDestinationDirectoryPath(image, this._targetPhotoPath);
        let destinationFilename = getDestinationFilename(image);

        let currentPath = path.join(image.directoryPath, image.filename);
        let targetPath = path.join(destinationDirectoryPath, destinationFilename);

        await this._fileServices.move(currentPath, targetPath);
        await this._photoImageDataAccess.updateLocation(id, destinationDirectoryPath, destinationFilename);
    }
}

function getDestinationDirectoryPath(image, targetPhotoPath) {
    let takenMoment = moment(image.properties.takenDateTime);
    return path.join(targetPhotoPath, takenMoment.format("YYYY-MM"));
}

function getDestinationFilename(image) {
    let takenMoment = moment(image.properties.takenDateTime);
    let filenameParts = [
        takenMoment.format("DD HH_mm_ss"),
        (image.properties.camera || "").trim().toLowerCase(),
        image.properties.imageNumber
    ].filter(p => !!p);

    return filenameParts.join(" ") + path.extname(image.filename).toLowerCase();
}