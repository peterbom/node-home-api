import {Log} from "./log";
import path from "path";
import moment from "moment";
import md5 from "md5";

export class ImageUtils {
    constructor (targetPhotoPath) {
        this._targetPhotoPath = targetPhotoPath;
    }

    getImageHash(imageProperties) {
        if (!imageProperties) {
            return null;
        }

        if (!imageProperties.takenDateTime) {
            return null;
        }

        // Only include identifiers that affect the resulting
        // filename, because we want to ensure that filename
        // conflicts can be reliably detected by hash conflicts.
        let identifiers = {
            type: imageProperties.fileType,
            date: imageProperties.takenDateTime,
            camera: imageProperties.camera,
            number: imageProperties.imageNumber
        };

        return md5(JSON.stringify(identifiers));
    }

    getDestinationDirectoryPath(imageProperties) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return null;
        }

        let takenMoment = moment(imageProperties.takenDateTime);
        return path.join(this._targetPhotoPath, takenMoment.format("YYYY-MM"));
    }

    getDestinationFilename(imageProperties, filename) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return null;
        }

        let takenMoment = moment(imageProperties.takenDateTime);
        let filenameParts = [
            takenMoment.format("DD HH_mm_ss"),
            (imageProperties.camera || "").trim().toLowerCase(),
            imageProperties.imageNumber
        ].filter(p => !!p);

        return filenameParts.join(" ") + path.extname(filename).toLowerCase();
    }

    requiresMovement(directoryPath, filename, imageProperties) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return false;
        }

        let currentPath = path.join(directoryPath, filename);
        let destinationPath = path.join(
            this.getDestinationDirectoryPath(imageProperties),
            this.getDestinationFilename(imageProperties, filename));

        return currentPath !== destinationPath;
    }
}