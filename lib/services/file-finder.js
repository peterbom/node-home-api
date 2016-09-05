"use strict";

exports.__esModule = true;
exports.FileFinder = undefined;

var _findFiles = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(baseDirectory, skipDirectoryRegexes, fileMatchRegex) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
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
                                        directoryPath: root,
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

                            walker.on("end", function () {
                                fulfill(files);
                            });
                        });

                    case 2:
                        return _context4.abrupt("return", _context4.sent);

                    case 3:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function _findFiles(_x7, _x8, _x9) {
        return _ref4.apply(this, arguments);
    };
}();

var _log = require("../shared/log");

var _walk = require("walk");

var _walk2 = _interopRequireDefault(_walk);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = (0, _promisifyNode2.default)("fs");

var FileFinder = exports.FileFinder = function () {
    function FileFinder() {
        _classCallCheck(this, FileFinder);
    }

    FileFinder.prototype.findFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(baseDirectories, skipDirectoryRegexes, fileMatchRegex) {
            var promises, fileArrays;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            promises = baseDirectories.map(function (d) {
                                return _findFiles(d, skipDirectoryRegexes, fileMatchRegex);
                            });
                            _context.next = 3;
                            return Promise.all(promises);

                        case 3:
                            fileArrays = _context.sent;
                            return _context.abrupt("return", fileArrays.reduce(function (files1, files2) {
                                return files1.concat(files2);
                            }, []));

                        case 5:
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

    FileFinder.prototype.getFiles = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directoryPath, fileMatchRegex) {
            var _this = this;

            var items, filenames, isFile;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return fs.readdir(directoryPath);

                        case 2:
                            items = _context3.sent;

                            items = items.filter(function (item) {
                                return fileMatchRegex.test(item);
                            });

                            filenames = [];

                            isFile = function () {
                                var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(item) {
                                    var itemPath, stats;
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    itemPath = _path2.default.join(directoryPath, item);
                                                    _context2.next = 3;
                                                    return fs.stat(itemPath);

                                                case 3:
                                                    stats = _context2.sent;

                                                    if (stats.isFile()) {
                                                        filenames.push(item);
                                                    }

                                                case 5:
                                                case "end":
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this);
                                }));

                                return function isFile(_x6) {
                                    return _ref3.apply(this, arguments);
                                };
                            }();

                            _context3.next = 8;
                            return Promise.all(items.map(isFile));

                        case 8:
                            return _context3.abrupt("return", filenames);

                        case 9:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getFiles(_x4, _x5) {
            return _ref2.apply(this, arguments);
        }

        return getFiles;
    }();

    return FileFinder;
}();