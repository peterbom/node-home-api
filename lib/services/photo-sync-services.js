"use strict";

exports.__esModule = true;
exports.PhotoSyncServices = undefined;

var getFilePropertyLookup = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(exifTool, directoryPath, filenames) {
        var filePaths, filePropertyLookup, results, _iterator2, _isArray2, _i2, _ref8, filename, filePath;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (filenames.length) {
                            _context6.next = 2;
                            break;
                        }

                        return _context6.abrupt("return", {});

                    case 2:
                        filePaths = filenames.map(function (f) {
                            return _path2.default.join(directoryPath, f);
                        });

                        // Attempt to read all files first

                        _context6.next = 5;
                        return exifTool.getProperties.apply(exifTool, filePaths);

                    case 5:
                        filePropertyLookup = _context6.sent;

                        if (!filePropertyLookup) {
                            _context6.next = 8;
                            break;
                        }

                        return _context6.abrupt("return", filePropertyLookup);

                    case 8:

                        // Reading all files failed. Attempt them one-by-one
                        results = {};
                        _iterator2 = filenames, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                    case 10:
                        if (!_isArray2) {
                            _context6.next = 16;
                            break;
                        }

                        if (!(_i2 >= _iterator2.length)) {
                            _context6.next = 13;
                            break;
                        }

                        return _context6.abrupt("break", 28);

                    case 13:
                        _ref8 = _iterator2[_i2++];
                        _context6.next = 20;
                        break;

                    case 16:
                        _i2 = _iterator2.next();

                        if (!_i2.done) {
                            _context6.next = 19;
                            break;
                        }

                        return _context6.abrupt("break", 28);

                    case 19:
                        _ref8 = _i2.value;

                    case 20:
                        filename = _ref8;
                        filePath = _path2.default.join(directoryPath, filename);
                        _context6.next = 24;
                        return exifTool.getProperties(filePath);

                    case 24:
                        filePropertyLookup = _context6.sent;

                        results[filename] = filePropertyLookup ? filePropertyLookup[filename] : null;

                    case 26:
                        _context6.next = 10;
                        break;

                    case 28:
                        return _context6.abrupt("return", results);

                    case 29:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function getFilePropertyLookup(_x5, _x6, _x7) {
        return _ref7.apply(this, arguments);
    };
}();

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoSyncServices = exports.PhotoSyncServices = function () {
    function PhotoSyncServices(exifTool, imageDataAccess, fileFinder, photoBaseDirectories) {
        _classCallCheck(this, PhotoSyncServices);

        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    PhotoSyncServices.prototype.compare = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var files, directoryFilesLookup, directories, diffPromises, _loop, directoryPath, indexedDirectories, _loop2, _iterator, _isArray, _i, _ref2, _ret2;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._fileFinder.findFiles(this._photoBaseDirectories, [/(?!.*\/)?@.*/, /.*\.db/], /^(?!.*\.db$)/);

                        case 2:
                            files = _context2.sent;
                            directoryFilesLookup = {};

                            files.forEach(function (file) {
                                var files = directoryFilesLookup[file.directoryPath];

                                if (!files) {
                                    files = [];
                                    directoryFilesLookup[file.directoryPath] = files;
                                }

                                files.push(file.filename);
                            });

                            directories = [];
                            diffPromises = [];

                            _loop = function _loop(directoryPath) {
                                var files = directoryFilesLookup[directoryPath];

                                var directory = {
                                    directoryPath: directoryPath,
                                    fileCount: files.length,
                                    newFileCount: 0,
                                    deletedFileCount: 0
                                };

                                directories.push(directory);

                                var directoryDiff = function () {
                                    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                        var diff;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this._imageDataAccess.getDiff(directoryPath, files);

                                                    case 2:
                                                        diff = _context.sent;

                                                        directory.newFileCount = diff.new.length;
                                                        directory.deletedFileCount = diff.deleted.length;

                                                    case 5:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function directoryDiff() {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();

                                diffPromises.push(directoryDiff());
                            };

                            for (directoryPath in directoryFilesLookup) {
                                _loop(directoryPath);
                            }

                            _context2.next = 11;
                            return this._imageDataAccess.getIndexedDirectories();

                        case 11:
                            indexedDirectories = _context2.sent;

                            _loop2 = function _loop2() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref2 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref2 = _i.value;
                                }

                                var indexedDirectory = _ref2;

                                if (!directories.some(function (d) {
                                    return d.directoryPath.toLowerCase() === indexedDirectory.directoryPath;
                                })) {
                                    directories.push({
                                        directoryPath: indexedDirectory.directoryPath,
                                        newFileCount: 0,
                                        deletedFileCount: indexedDirectory.imageCount
                                    });
                                }
                            };

                            _iterator = indexedDirectories, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 14:
                            _ret2 = _loop2();

                            if (!(_ret2 === "break")) {
                                _context2.next = 17;
                                break;
                            }

                            return _context2.abrupt("break", 19);

                        case 17:
                            _context2.next = 14;
                            break;

                        case 19:
                            _context2.next = 21;
                            return Promise.all(diffPromises);

                        case 21:
                            return _context2.abrupt("return", directories);

                        case 22:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function compare() {
            return _ref.apply(this, arguments);
        }

        return compare;
    }();

    PhotoSyncServices.prototype.invalidate = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directoryPath) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._imageDataAccess.invalidateImages(directoryPath);

                        case 2:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function invalidate(_x) {
            return _ref4.apply(this, arguments);
        }

        return invalidate;
    }();

    PhotoSyncServices.prototype.index = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(directoryPath, maxIndexCount) {
            var indexedFilenames, indexedFilenameLookup, filenames, batch, filePropertyLookup, imagePromises, filename, properties;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._imageDataAccess.getImageFilenames(directoryPath);

                        case 2:
                            indexedFilenames = _context4.sent;
                            indexedFilenameLookup = {};

                            indexedFilenames.forEach(function (f) {
                                return indexedFilenameLookup[f] = true;
                            });

                            // Get all the files on disk
                            _context4.next = 7;
                            return this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);

                        case 7:
                            filenames = _context4.sent;

                            filenames = filenames.filter(function (f) {
                                // Exclude those which are already indexed
                                return !indexedFilenameLookup[f.toLowerCase()];
                            });

                            // Only attempt the first maxIndexCount to keep time down
                            batch = filenames.splice(0, maxIndexCount);
                            _context4.next = 12;
                            return getFilePropertyLookup(this._exifTool, directoryPath, batch);

                        case 12:
                            filePropertyLookup = _context4.sent;
                            imagePromises = [];

                            for (filename in filePropertyLookup) {
                                properties = filePropertyLookup[filename]; // Can be null for unreadable files

                                imagePromises.push(this._imageDataAccess.upsertImage(directoryPath, filename, properties));
                            }

                            _context4.next = 17;
                            return Promise.all(imagePromises);

                        case 17:
                            return _context4.abrupt("return", {
                                indexed: batch.length,
                                remaining: filenames.length
                            });

                        case 18:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function index(_x2, _x3) {
            return _ref5.apply(this, arguments);
        }

        return index;
    }();

    PhotoSyncServices.prototype.clean = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(directoryPath) {
            var filenames;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);

                        case 2:
                            filenames = _context5.sent;
                            _context5.next = 5;
                            return this._imageDataAccess.cleanExcept(directoryPath, filenames);

                        case 5:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function clean(_x4) {
            return _ref6.apply(this, arguments);
        }

        return clean;
    }();

    return PhotoSyncServices;
}();