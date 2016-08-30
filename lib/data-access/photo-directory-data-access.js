"use strict";

exports.__esModule = true;
exports.PhotoDirectoryDataAccess = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDirectoryDataAccess = exports.PhotoDirectoryDataAccess = function () {
    function PhotoDirectoryDataAccess(exifTool, imageDataAccess, fileFinder, photoBaseDirectories) {
        _classCallCheck(this, PhotoDirectoryDataAccess);

        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    PhotoDirectoryDataAccess.prototype.getAll = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var files, directories, directoryLookup, unknownCheckPromises, _loop, _iterator, _isArray, _i, _ref2, _ret;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._fileFinder.findFiles(this._photoBaseDirectories, [/(?!.*\/)?@.*/, /.*\.db/], /^(?!.*\.db$)/);

                        case 2:
                            files = _context2.sent;
                            directories = [];
                            directoryLookup = {};

                            files.forEach(function (file) {
                                var directory = directoryLookup[file.path];

                                if (!directory) {
                                    directory = {
                                        path: file.path,
                                        files: [],
                                        hasUnknownFiles: null
                                    };

                                    directories.push(directory);
                                    directoryLookup[file.path] = directory;
                                }

                                directory.files.push(file.filename);
                            });

                            unknownCheckPromises = [];

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref2 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref2 = _i.value;
                                }

                                var directory = _ref2;

                                var unknownCheck = function () {
                                    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this._imageDataAccess.hasUnknownFiles(directory.path, directory.files);

                                                    case 2:
                                                        directory.hasUnknownFiles = _context.sent;

                                                    case 3:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function unknownCheck() {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();

                                unknownCheckPromises.push(unknownCheck());
                            };

                            _iterator = directories, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 9:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context2.next = 12;
                                break;
                            }

                            return _context2.abrupt("break", 14);

                        case 12:
                            _context2.next = 9;
                            break;

                        case 14:
                            _context2.next = 16;
                            return Promise.all(unknownCheckPromises);

                        case 16:
                            return _context2.abrupt("return", directories);

                        case 17:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getAll() {
            return _ref.apply(this, arguments);
        }

        return getAll;
    }();

    PhotoDirectoryDataAccess.prototype.reindex = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(directory) {
            var _this2 = this;

            var files, batchSize, batches, reindexFiles;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._fileFinder.getFiles(directory, /^(?!.*\.db$)/);

                        case 2:
                            files = _context4.sent;


                            // split the files into batches
                            batchSize = 100;
                            batches = [];

                            while (files.length) {
                                batches.push(files.splice(0, batchSize));
                            }

                            reindexFiles = function () {
                                var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(filenames) {
                                    var _exifTool;

                                    var filePaths, filePropertyLookup, imagePromises, filename, properties;
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    filePaths = filenames.map(function (f) {
                                                        return _path2.default.join(directory, f);
                                                    });
                                                    _context3.next = 3;
                                                    return (_exifTool = _this2._exifTool).getProperties.apply(_exifTool, filePaths);

                                                case 3:
                                                    filePropertyLookup = _context3.sent;
                                                    imagePromises = [];

                                                    for (filename in filePropertyLookup) {
                                                        properties = filePropertyLookup[filename];

                                                        imagePromises.push(_this2._imageDataAccess.upsertImage(directory, filename, properties));
                                                    }

                                                    _context3.next = 8;
                                                    return Promise.all(imagePromises);

                                                case 8:
                                                case "end":
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this2);
                                }));

                                return function reindexFiles(_x2) {
                                    return _ref5.apply(this, arguments);
                                };
                            }();

                            _context4.next = 9;
                            return Promise.all(batches.map(reindexFiles));

                        case 9:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function reindex(_x) {
            return _ref4.apply(this, arguments);
        }

        return reindex;
    }();

    return PhotoDirectoryDataAccess;
}();