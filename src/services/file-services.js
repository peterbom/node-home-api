const Log = require("../shared/log").Log;
const path = require("path");
const promisify = require("promisify-node");

let mv = promisify("mv");
let fs = promisify("fs");

class FileServices {
    constructor () {
    }

    async findDirectories (baseDirectories, ...skipDirectoryRegexes) {
        let findDirectories = async baseDirectory => {
            var list = [];

            let dircheck = async fd => {
                let stats = await fs.stat(fd);
                if (stats.isDirectory() && !skipDirectoryRegexes.some(skipRegex => skipRegex.test(fd))) {
                    list.push(fd);
                    await walkdir(fd);
                }
            };

            let walkdir = async dir => {
                let files = await fs.readdir(dir);

                let promises = files.map(file => dircheck(path.join(dir, file)));
                await Promise.all(promises);
            };

            await dircheck(baseDirectory);

            return list;
        };

        let promises = baseDirectories.map(findDirectories);

        let resultArrays = await Promise.all(promises);
        let results = resultArrays.reduce((a, b) => a.concat(b), []);

        return results;
    }

    async getFiles (directoryPath, fileMatchRegex) {
        try {
            let directoryStats = await fs.stat(directoryPath);
            if (!directoryStats.isDirectory()) {
                return [];
            }
        } catch (err) {
            // This happens if the directory doesn't exist
            return [];
        }

        let items = await fs.readdir(directoryPath);
        items = items.filter(item => fileMatchRegex.test(item));

        let filenames = [];
        let isFile = async item => {
            let itemPath = path.join(directoryPath, item);
            let stats = await fs.stat(itemPath);
            if (stats.isFile()) {
                filenames.push(item);
            }
        }

        await Promise.all(items.map(isFile));

        return filenames;
    }

    async exists (filePath) {
        try {
            let stats = await fs.stat(filePath);
            return stats && stats.isFile();
        } catch (err) {
            return false;
        }
    }

    async delete (filePath) {
        await fs.unlink(filePath);
    }

    async move (fromFilePath, toFilePath) {
        await mv(fromFilePath, toFilePath, {mkdirp: true, clobber: false});
    }
}

exports.FileServices = FileServices;