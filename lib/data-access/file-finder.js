"use strict";

exports.__esModule = true;
exports.FileFinder = undefined;

var _findDirectories = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(baseDirectory, skipDirectoryRegexes) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return new Promise(function (fulfill, reject) {
                            var directoryPaths = [baseDirectory];
                            var options = {
                                followLinks: false,
                                filters: skipDirectoryRegexes
                            };

                            var walker = _walk2.default.walk(baseDirectory, options);
                            walker.on("directories", function (root, dirStatsArray, next) {
                                var localPaths = dirStatsArray.map(function (stat) {
                                    return _path2.default.join(root, stat.name);
                                });
                                directoryPaths = directoryPaths.concat(localPaths);

                                next();
                            });

                            walker.on("errors", function (root, nodeStatsArray, next) {
                                reject(nodeStatsArray.map(function (stat) {
                                    return stat.error;
                                }));
                            });

                            walker.on("end", function () {
                                fulfill(directoryPaths);
                            });
                        });

                    case 2:
                        return _context3.abrupt("return", _context3.sent);

                    case 3:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function _findDirectories(_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
}();

var _walk = require("walk");

var _walk2 = _interopRequireDefault(_walk);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileFinder = exports.FileFinder = function () {
    function FileFinder() {
        _classCallCheck(this, FileFinder);
    }

    FileFinder.prototype.findFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(baseDirectory, fileMatchRegex, skipDirectoryRegexes) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return new Promise(function (fulfill, reject) {
                                var files = [];
                                var options = {
                                    followLinks: false,
                                    filters: skipDirectoryRegexes
                                };

                                var walker = _walk2.default.walk(baseDirectory, options);
                                walker.on("file", function (root, stat, next) {
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

                                walker.on("end", function () {
                                    fulfill(files);
                                });
                            });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findFiles(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return findFiles;
    }();

    FileFinder.prototype.findDirectories = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(directories, skipDirectoryRegexes) {
            var promises, pathArrays;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            promises = directories.map(function (d) {
                                return _findDirectories(d, skipDirectoryRegexes);
                            });
                            _context2.next = 3;
                            return Promise.all(promises);

                        case 3:
                            pathArrays = _context2.sent;
                            return _context2.abrupt("return", pathArrays.reduce(function (paths1, paths2) {
                                return paths1.concat(paths2);
                            }, []));

                        case 5:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function findDirectories(_x4, _x5) {
            return _ref2.apply(this, arguments);
        }

        return findDirectories;
    }();

    return FileFinder;
}();