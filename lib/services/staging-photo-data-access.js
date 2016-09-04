"use strict";

exports.__esModule = true;
exports.StagingPhotoDataAccess = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StagingPhotoDataAccess = exports.StagingPhotoDataAccess = function () {
    function StagingPhotoDataAccess(exifTool, imageDataAccess, fileFinder, stagingPhotoPath) {
        _classCallCheck(this, StagingPhotoDataAccess);

        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    StagingPhotoDataAccess.prototype.getAllFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var _this = this;

            var files, directories, directoryLookup, updatePromises;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._fileFinder.findFiles([this._stagingPhotoPath], [/(?!.*\/)?@.*/, /.*\.db/], /^(?!.*\.db$)/);

                        case 2:
                            files = _context.sent;
                            directories = [];
                            directoryLookup = {};
                            updatePromises = [];

                            files.forEach(function (file) {
                                var directory = directoryLookup[file.path];

                                if (!directory) {
                                    directory = {
                                        path: file.path,
                                        files: []
                                    };

                                    directories.push(directory);
                                    directoryLookup[file.path] = directory;
                                }

                                directory.files.push({
                                    filename: file.filename,
                                    ino: file.ino
                                });

                                updatePromises.push(_this._imageDataAccess.upsertLocation(file.ino, file.path, file.filename));
                            });

                            _context.next = 9;
                            return Promise.all(updatePromises);

                        case 9:
                            return _context.abrupt("return", directories);

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getAllFiles() {
            return _ref.apply(this, arguments);
        }

        return getAllFiles;
    }();

    StagingPhotoDataAccess.prototype.isKnownImageFile = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(inode) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._imageDataAccess.hasImage(inode);

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function isKnownImageFile(_x) {
            return _ref2.apply(this, arguments);
        }

        return isKnownImageFile;
    }();

    StagingPhotoDataAccess.prototype.getImageInfo = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(inode) {
            var image, filePath;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._imageDataAccess.findImage(inode);

                        case 2:
                            image = _context3.sent;
                            filePath = _path2.default.join(image.path, image.filename);

                            if (image.imageData) {
                                _context3.next = 8;
                                break;
                            }

                            _context3.next = 7;
                            return this._exifTool.getImageData(filePath);

                        case 7:
                            image.imageData = _context3.sent;

                        case 8:
                            if (image.tags) {
                                _context3.next = 12;
                                break;
                            }

                            _context3.next = 11;
                            return this._exifTool.getTags(filePath);

                        case 11:
                            image.tags = _context3.sent;

                        case 12:
                            _context3.next = 14;
                            return this._imageDataAccess.upsertImage(inode, image.path, image.filename, image.imageData, image.tags);

                        case 14:
                            return _context3.abrupt("return", Object.assign({}, image.imageData, image.tags));

                        case 15:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getImageInfo(_x2) {
            return _ref3.apply(this, arguments);
        }

        return getImageInfo;
    }();

    return StagingPhotoDataAccess;
}();