const Log = require("../shared/log").Log;
const request = require("request");
const rp = require("request-promise");
const path = require("path");
const promisify = require("promisify-node");

let fs = promisify("fs");

class PhotoFrameServices {
    constructor (photoImageDataAccess, ipAddress) {
        this._photoImageDataAccess = photoImageDataAccess;
        this._ipAddress = ipAddress;
    }

    async list() {
        let files = await this.getAllFiles();
        let ids = files.map(f => path.basename(f, path.extname(f)));

        let images = await this._photoImageDataAccess.getByIds(ids, true);

        return images.map(i => i._id);
    }

    async addImages(ids) {
        // set the upload directory to the card root
        await this.setUploadDirectory("/");

        let files = await this.getAllFiles();
        let images = await this._photoImageDataAccess.getByIds(ids);

        let existingFilenameSet = new Set(files);
        let imageFilenames = images.map(i => ({
            image: i,
            targetFilename: this.getTargetFilename(i)
        }));

        let imageFilesToAdd = imageFilenames.filter(i => !existingFilenameSet.has(i.targetFilename));

        // Upload files serially. Attempting to do it in parallel seems to cause
        // the server to hang.
        for (let imageFile of imageFilesToAdd) {
            await this.uploadFile(imageFile.image, imageFile.targetFilename)
        }
    }

    async clearImages() {
        let files = await this.getAllFiles();

        await Promise.all(files.map(f => this.deleteFile(f)));
    }

    async setUploadDirectory(dir) {
        let url = `http://${this._ipAddress}/upload.cgi?UPDIR=/`;

        let options = {
            uri: url,
            json: false
        };

        await rp(options);
    }

    async getAllFiles() {
        let url = `http://${this._ipAddress}/command.cgi?op=100&DIR=/`;

        let options = {
            uri: url,
            json: false
        };

        let resultText = await rp(options);
        let lines = resultText.match(/[^\r\n]+/g);

        // <directory>, <filename>, <size>, <attribute>, <date>, <time>
        // Notes:
        // - directory can be empty
        // - filename can contain commas
        // - attribute consists of:
        //   - Bit 5   Archive      mask 32
        //   - Bit 4   Directly     mask 16 (think it means 'directory')
        //   - Bit 3   Volume       mask 8
        //   - Bit 2   System file  mask 4
        //   - Bit 1   Hidden file  mask 2
        //   - Bit 0   Read only    mask 1
        let fileRegex = /[!,]*,(.+),\d+,(\d+),\d+,\d+/;

        let files = [];
        for (let line of lines) {
            let match = fileRegex.exec(line);
            if (match) {
                let filename = match[1];
                let attributes = Number.parseInt(match[2]);
                // Check it has attributes and is not a directory
                if (attributes && !(attributes & 16)) {
                    files.push(filename);
                }
            }
        }

        return files;
    }

    async deleteFile(filename) {
        let url = `http://${this._ipAddress}/upload.cgi?DEL=/${filename}`

        let options = {
            uri: url,
            json: false
        };

        await rp(options);
    }

    getTargetFilename(image) {
        return image._id + path.extname(image.filename);
    }

    async uploadFile(image, targetFilename) {
        let sourceFilePath = path.join(image.directoryPath, image.filename);

        let url = `http://${this._ipAddress}/upload.cgi`;

        // Don't use the promise library here:
        // "STREAMING THE RESPONSE (e.g. .pipe(...)) is DISCOURAGED because Request-Promise
        // would grow the memory footprint for large requests unnecessarily high. Use the
        // original Request library for that"
        let resolver = {};
        let promise = new Promise((fulfill, reject) => {
            resolver.fulfill = fulfill;
            resolver.reject = reject;
        });

        let options = {
            method: "POST",
            url: url,
            formData: {
                file: {
                    value: fs.createReadStream(sourceFilePath),
                    options: {
                        filename: targetFilename
                    }
                }
            },
            callback: (error, response, body) => {
                if (error) {
                    resolver.reject(error);
                } else {
                    resolver.fulfill(body);
                }
            }
        }

        request.post(options);

        await promise;
    }
}

exports.PhotoFrameServices = PhotoFrameServices;