
export class PhotoDirectoryDataAccess {
    constructor (imageDataAccess, fileFinder, photoBaseDirectories) {
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    async getAll () {
        let files = await this._fileFinder.findFiles(
            this._photoBaseDirectories,
            [/(?!.*\/)?@.*/, /.*\.db/],
            /^(?!.*\.db$)/);

        let directories = [];
        let directoryLookup = {};
        files.forEach(file => {
            let directory = directoryLookup[file.path];

            if (!directory) {
                directory = {
                    path: file.path,
                    files: [],
                    hasUnknownFiles: null
                };

                directories.push(directory);
                directoryLookup[file.path] = directory;
            }

            directory.files.push(file.filename);
        });

        let unknownCheckPromises = [];
        for (let directory of directories) {
            let unknownCheck = async () => {
                directory.hasUnknownFiles = await this._imageDataAccess.hasUnknownFiles(directory.path, directory.files);
            };

            unknownCheckPromises.push(unknownCheck());
        }

        await Promise.all(unknownCheckPromises);

        return directories;
    }

    async getNew (directory) {
        
    }
}
