
export class PhotoDirectoryDataAccess {
    constructor (fileFinder, photoBaseDirectories) {
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    async getAll () {
        return await this._fileFinder.findDirectories(this._photoBaseDirectories, [/(?!.*\/)?@.*$/, /.*\.db/]);
    }

    async getNew (directory) {
        
    }
}
