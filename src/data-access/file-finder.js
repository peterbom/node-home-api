import walk from "walk";
import path from "path";

export class FileFinder {
    async findFiles (baseDirectory, fileMatchRegex, skipDirectoryRegexes) {
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
                        filename: stat.name,
                        ino: stat.ino
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

    async findDirectories (directories, skipDirectoryRegexes) {
        let promises = directories.map(d => findDirectories(d, skipDirectoryRegexes));
        let pathArrays = await Promise.all(promises);
        return pathArrays.reduce((paths1, paths2) => paths1.concat(paths2), []);
    }
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
