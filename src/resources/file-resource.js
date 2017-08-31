const Log = require("../shared/log").Log;
const path = require("path");

class FileResource {
    constructor (fileServices) {
        this._fileServices = fileServices;
    }

    async deleteFilePath (ctx) {
        let filePath = ctx.params.filePath;

        let exists = await this._fileServices.exists(filePath);
        if (!exists) {
            ctx.status = 404;
            return;
        }

        await this._fileServices.delete(filePath);
        ctx.status = 200;
    }

    async deleteCriteria (ctx) {
        if (!ctx.query.directoryPath || !ctx.query.filename) {
            ctx.status = 400;
            return;
        }

        let filePath = path.join(ctx.query.directoryPath, ctx.query.filename);

        let exists = await this._fileServices.exists(filePath);
        if (!exists) {
            ctx.status = 404;
            return;
        }

        await this._fileServices.delete(filePath);
        ctx.status = 200;
    }
}

exports.FileResource = FileResource;