const Log = require("../shared/log").Log;
const path = require("path");
const moment = require("moment");
const promisify = require("promisify-node");

let mkdirp = promisify("mkdirp");
let fs = promisify("fs");

class PhotoUploadServices {
    constructor (photoUploadDataAccess, stagingPhotoPath) {
        this._photoUploadDataAccess = photoUploadDataAccess;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    async create() {
        let directoryName = "upload " + moment().format("YYYY-MM-DD HH_mm_ss");
        let directoryPath = path.join(this._stagingPhotoPath, directoryName);

        await mkdirp(directoryPath);
        return await this._photoUploadDataAccess.create(directoryPath);
    }

    async getUpload(id) {
        return await this._photoUploadDataAccess.getById(id);
    }

    async addFile(upload, filename, readStream) {

        let writeStream = fs.createWriteStream(path.join(upload.directoryPath, filename));
        readStream.pipe(writeStream);

        await new Promise((fulfill, reject) => {
            writeStream.on("error", err => {
                reject(err);
            });

            writeStream.on("finish", () => {
                fulfill();
            });
        });
    }
}

exports.PhotoUploadServices = PhotoUploadServices;