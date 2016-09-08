"use strict";

exports.__esModule = true;
exports.PhotoIndexServices = undefined;

var setPropertiesForImageInfos = function () {
    var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(exifTool, imageInfos) {
        var filePaths, imageInfoLookup, allFilesPropertyLookup, _iterator2, _isArray2, _i2, _ref11, filePath, filePropertyLookup, _filePath, imageInfo, properties;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        filePaths = [];
                        imageInfoLookup = {};

                        imageInfos.forEach(function (imageInfo) {
                            var filePath = _path2.default.join(imageInfo.directoryPath, imageInfo.filename);
                            filePaths.push(filePath);
                            imageInfoLookup[filePath] = imageInfo;
                        });

                        // Attempt to read all files first
                        _context9.next = 5;
                        return exifTool.getProperties.apply(exifTool, filePaths);

                    case 5:
                        allFilesPropertyLookup = _context9.sent;

                        if (allFilesPropertyLookup) {
                            _context9.next = 26;
                            break;
                        }

                        // Reading all files failed. Attempt them one-by-one
                        allFilesPropertyLookup = {};
                        _iterator2 = filePaths, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                    case 9:
                        if (!_isArray2) {
                            _context9.next = 15;
                            break;
                        }

                        if (!(_i2 >= _iterator2.length)) {
                            _context9.next = 12;
                            break;
                        }

                        return _context9.abrupt("break", 26);

                    case 12:
                        _ref11 = _iterator2[_i2++];
                        _context9.next = 19;
                        break;

                    case 15:
                        _i2 = _iterator2.next();

                        if (!_i2.done) {
                            _context9.next = 18;
                            break;
                        }

                        return _context9.abrupt("break", 26);

                    case 18:
                        _ref11 = _i2.value;

                    case 19:
                        filePath = _ref11;
                        _context9.next = 22;
                        return exifTool.getProperties(filePath);

                    case 22:
                        filePropertyLookup = _context9.sent;

                        allFilesPropertyLookup[filePath] = filePropertyLookup ? filePropertyLookup[filePath] : null;

                    case 24:
                        _context9.next = 9;
                        break;

                    case 26:

                        for (_filePath in allFilesPropertyLookup) {
                            imageInfo = imageInfoLookup[_filePath];
                            properties = allFilesPropertyLookup[_filePath]; // Can be null for unreadable files

                            imageInfo.properties = properties;
                        }

                    case 27:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function setPropertiesForImageInfos(_x8, _x9) {
        return _ref10.apply(this, arguments);
    };
}();

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoIndexServices = exports.PhotoIndexServices = function () {
    function PhotoIndexServices(exifTool, photoImageDataAccess, fileFinder, photoBaseDirectories) {
        _classCallCheck(this, PhotoIndexServices);

        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    PhotoIndexServices.prototype.compare = function () {
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
                                                        return _this._photoImageDataAccess.getDiff(directoryPath, files);

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
                            return this._photoImageDataAccess.getIndexedDirectories();

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

    PhotoIndexServices.prototype.invalidatePath = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directoryPath) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._photoImageDataAccess.invalidateImages(directoryPath);

                        case 2:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function invalidatePath(_x) {
            return _ref4.apply(this, arguments);
        }

        return invalidatePath;
    }();

    PhotoIndexServices.prototype.invalidateImageIds = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ids) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._photoImageDataAccess.invalidateImageIds(ids);

                        case 2:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function invalidateImageIds(_x2) {
            return _ref5.apply(this, arguments);
        }

        return invalidateImageIds;
    }();

    PhotoIndexServices.prototype.indexPath = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(directoryPath, maxIndexCount) {
            var _this2 = this;

            var indexedImages, indexedFilenameLookup, filenames, batch, imageInfos, imagePromises;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this._photoImageDataAccess.getByPath(directoryPath);

                        case 2:
                            indexedImages = _context5.sent;
                            indexedFilenameLookup = {};

                            indexedImages.forEach(function (img) {
                                return indexedFilenameLookup[img.filename] = true;
                            });

                            // Get all the files on disk
                            _context5.next = 7;
                            return this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);

                        case 7:
                            filenames = _context5.sent;

                            filenames = filenames.filter(function (f) {
                                // Exclude those which are already indexed
                                return !indexedFilenameLookup[f.toLowerCase()];
                            });

                            // Only attempt the first maxIndexCount to keep time down
                            batch = filenames.splice(0, maxIndexCount);
                            imageInfos = batch.map(function (f) {
                                return {
                                    directoryPath: directoryPath,
                                    filename: f
                                };
                            });
                            _context5.next = 13;
                            return setPropertiesForImageInfos(this._exifTool, imageInfos);

                        case 13:
                            imagePromises = imageInfos.map(function (i) {
                                return _this2._photoImageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties);
                            });
                            _context5.next = 16;
                            return Promise.all(imagePromises);

                        case 16:
                            return _context5.abrupt("return", {
                                indexed: batch.length,
                                remaining: filenames.length
                            });

                        case 17:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function indexPath(_x3, _x4) {
            return _ref6.apply(this, arguments);
        }

        return indexPath;
    }();

    PhotoIndexServices.prototype.indexImageIds = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ids) {
            var _this3 = this;

            var images, imageInfos, imagePromises;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return this._photoImageDataAccess.getByIds(ids, true);

                        case 2:
                            images = _context6.sent;
                            imageInfos = images.map(function (i) {
                                return {
                                    directoryPath: i.directoryPath,
                                    filename: i.filename
                                };
                            });
                            _context6.next = 6;
                            return setPropertiesForImageInfos(this._exifTool, imageInfos);

                        case 6:
                            imagePromises = imageInfos.map(function (i) {
                                return _this3._photoImageDataAccess.upsertImage(i.directoryPath, i.filename, i.properties);
                            });
                            _context6.next = 9;
                            return Promise.all(imagePromises);

                        case 9:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function indexImageIds(_x5) {
            return _ref7.apply(this, arguments);
        }

        return indexImageIds;
    }();

    PhotoIndexServices.prototype.cleanPath = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(directoryPath) {
            var filenames;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.next = 2;
                            return this._fileFinder.getFiles(directoryPath, /^(?!.*\.db$)/);

                        case 2:
                            filenames = _context7.sent;
                            _context7.next = 5;
                            return this._photoImageDataAccess.cleanExcept(directoryPath, filenames);

                        case 5:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function cleanPath(_x6) {
            return _ref8.apply(this, arguments);
        }

        return cleanPath;
    }();

    PhotoIndexServices.prototype.cleanImageIds = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(ids) {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return this._photoImageDataAccess.cleanIds(ids);

                        case 2:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function cleanImageIds(_x7) {
            return _ref9.apply(this, arguments);
        }

        return cleanImageIds;
    }();

    return PhotoIndexServices;
}();