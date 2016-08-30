import walk from "walk";
import path from "path";
import promisify from "promisify-node";

let fs = promisify("fs");

export class FileFinder {
    async findFiles (baseDirectories, skipDirectoryRegexes, fileMatchRegex) {
        let promises = baseDirectories.map(d => findFiles(d, skipDirectoryRegexes, fileMatchRegex));
        let fileArrays = await Promise.all(promises);
        return fileArrays.reduce((files1, files2) => files1.concat(files2), []);
    }

    async getFiles (directory, fileMatchRegex) {
        let items = await fs.readdir(directory);
        items = items.filter(item => fileMatchRegex.test(item));

        let filenames = [];
        let isFile = async item => {
            let itemPath = path.join(directory, item);
            let stats = await fs.stat(itemPath);
            if (stats.isFile()) {
                filenames.push(item);
            }
        }

        await Promise.all(items.map(isFile));

        return filenames;
    }
}

async function findFiles (baseDirectory, skipDirectoryRegexes, fileMatchRegex) {
    return await new Promise(function (fulfill, reject) {
        var files = [];
        var options = {
            followLinks: false,
            filters: skipDirectoryRegexes
        };
        
        var walker = walk.walk(baseDirectory, options);
        walker.on("file", function(root, stat, next) {
            if (fileMatchRegex.test(stat.name)) {
                files.push({
                    path: root,
                    filename: stat.name
                });
            }

            next();
        });
        
        walker.on("errors", function (root, nodeStatsArray, next) {
            reject(nodeStatsArray.map(function (stat) {
                return stat.error;
            }));
        });
        
        walker.on("end", function() {
            fulfill(files);
        });
    });
}
