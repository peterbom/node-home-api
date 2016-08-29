import walk from "walk";

export class FileFinder {
    async find(basePath, fileMatchRegex, skipDirectoryRegexes) {
        return await new Promise(function (fulfill, reject) {
            var files = [];
            var options = {
                followLinks: false,
                filters: skipDirectoryRegexes
            };
            
            var walker = walk.walk(basePath, options);
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
}