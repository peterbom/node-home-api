
export class PhotoDirectoryDataAccess {
    constructor (fileFinder, photoBaseDirectories) {
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    async getAll () {
    	// TODO: Remove/replace with this - test to compare speed
    	await this._fileFinder.findFiles(
            this._photoBaseDirectories,
            [/(?!.*\/)?@.*/, /.*\.db/],
            /^(?!.*\.db$)/);

        return await this._fileFinder.findDirectories(this._photoBaseDirectories, [/(?!.*\/)?@.*$/, /.*\.db/]);
    }

    async getNew (directory) {
        
    }
}
