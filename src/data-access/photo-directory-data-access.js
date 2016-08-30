import path from "path";

export class PhotoDirectoryDataAccess {
    constructor (exifTool, imageDataAccess, fileFinder, photoBaseDirectories) {
        this._exifTool = exifTool;
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

    async reindex (directory) {
        let files = await this._fileFinder.getFiles(directory, /^(?!.*\.db$)/);

        let reindexFile = async filename => {
            let filePath = path.join(directory, filename);
            let properties = await this._exifTool.getProperties(filePath);
            await this._imageDataAccess.upsertImage(directory, filename, properties);
        };

        await Promise.all(files.map(reindexFile));
    }
}
