
export class StagingPhotoDataAccess {
    constructor (fileFinder, stagingPhotoPath) {
        this._fileFinder = fileFinder;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    async getAllFiles () {
        let files = await this._fileFinder.find(
            this._stagingPhotoPath,
            /^(?!.*\.db$)/,
            [/.*\/@.*/, /.*\.db/]);

        let directories = [];
        let directoryLookup = {};
        files.forEach(file => {
            let directory = directoryLookup[file.path];

            if (!directory) {
                directory = {
                    path: file.path,
                    files: []
                };

                directories.push(directory);
                directoryLookup[file.path] = directory;
            }

            directory.files.push({
                filename: file.filename,
                ino: file.ino
            });
        });

        return directories;
    }
}