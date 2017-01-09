import {Log} from "../shared/log";

export class PhotoUploadDataAccess {
    constructor (dbManager) {
        this._dbManager = dbManager;
        this._photoUploads = dbManager.get("photoUploads");
    }

    async create(directoryPath) {
        let upload = {
            date: new Date(),
            directoryPath: directoryPath
        };

        return await this._photoUploads.insert(upload);
    }

    async getById(id) {
        let objectId = this._dbManager.id(id);
        return await this._photoUploads.findOne({_id: objectId});
    }
}
