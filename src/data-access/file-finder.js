import walk from "walk";
import path from "path";

export class FileFinder {
    async findFiles (baseDirectories, skipDirectoryRegexes, fileMatchRegex) {
        let promises = baseDirectories.map(d => findFiles(d, skipDirectoryRegexes, fileMatchRegex));
        let fileArrays = await Promise.all(promises);
        return fileArrays.reduce((files1, files2) => files1.concat(files2), []);
    }

    async findDirectories (baseDirectories, skipDirectoryRegexes) {
        let promises = baseDirectories.map(d => findDirectories(d, skipDirectoryRegexes));
        let pathArrays = await Promise.all(promises);
        return pathArrays.reduce((paths1, paths2) => paths1.concat(paths2), []);
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

async function findDirectories (baseDirectory, skipDirectoryRegexes) {
    return await new Promise(function (fulfill, reject) {
        var directoryPaths = [baseDirectory];
        var options = {
            followLinks: false,
            filters: skipDirectoryRegexes
        };
        
        var walker = walk.walk(baseDirectory, options);
        walker.on("directories", function(root, dirStatsArray, next) {
            dirStatsArray = dirStatsArray.filter(
                stat => !skipDirectoryRegexes.some(regex => regex.test(stat.name)));

            let localPaths = dirStatsArray.map(stat => path.join(root, stat.name));
            directoryPaths = directoryPaths.concat(localPaths);

            next();
        });
        
        walker.on("errors", function (root, nodeStatsArray, next) {
            reject(nodeStatsArray.map(function (stat) {
                return stat.error;
            }));
        });
        
        walker.on("end", function() {
            fulfill(directoryPaths);
        });
    });
}
