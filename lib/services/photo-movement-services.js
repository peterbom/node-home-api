"use strict";

exports.__esModule = true;
exports.PhotoMovementServices = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoMovementServices = exports.PhotoMovementServices = function () {
    function PhotoMovementServices(photoImageDataAccess, fileServices, stagingPhotoPath, targetPhotoPath) {
        _classCallCheck(this, PhotoMovementServices);

        this._photoImageDataAccess = photoImageDataAccess;
        this._fileServices = fileServices;
        this._stagingPhotoPath = stagingPhotoPath;
        this._targetPhotoPath = targetPhotoPath;
    }

    PhotoMovementServices.prototype.getAllImagesForMovement = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var allIds, duplicateHashes, duplicateHashLookup, batches, results, _iterator, _isArray, _i, _ref2, batch, images, promises, _loop, _iterator2, _isArray2, _i2, _ref3, _ret;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImageDataAccess.getIds();

                        case 2:
                            allIds = _context2.sent;
                            _context2.next = 5;
                            return this._photoImageDataAccess.listDuplicateHashes();

                        case 5:
                            duplicateHashes = _context2.sent;
                            duplicateHashLookup = {};

                            duplicateHashes.forEach(function (h) {
                                return duplicateHashLookup[h] = true;
                            });

                            // Process these in batches to avoid loading an excessive number of images at once
                            batches = [];

                            while (allIds.length) {
                                batches.push(allIds.splice(0, 100));
                            }

                            results = [];
                            _iterator = batches, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 12:
                            if (!_isArray) {
                                _context2.next = 18;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context2.next = 15;
                                break;
                            }

                            return _context2.abrupt("break", 38);

                        case 15:
                            _ref2 = _iterator[_i++];
                            _context2.next = 22;
                            break;

                        case 18:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context2.next = 21;
                                break;
                            }

                            return _context2.abrupt("break", 38);

                        case 21:
                            _ref2 = _i.value;

                        case 22:
                            batch = _ref2;
                            _context2.next = 25;
                            return this._photoImageDataAccess.getByIds(batch, true);

                        case 25:
                            images = _context2.sent;
                            promises = [];

                            _loop = function _loop() {
                                if (_isArray2) {
                                    if (_i2 >= _iterator2.length) return "break";
                                    _ref3 = _iterator2[_i2++];
                                } else {
                                    _i2 = _iterator2.next();
                                    if (_i2.done) return "break";
                                    _ref3 = _i2.value;
                                }

                                var image = _ref3;

                                var destinationDirectoryPath = getDestinationDirectoryPath(image, _this._targetPhotoPath);
                                var destinationFilename = getDestinationFilename(image);

                                if (destinationDirectoryPath !== image.directoryPath || destinationFilename !== image.filename) {
                                    (function () {
                                        var result = {
                                            id: image._id,
                                            current: {
                                                directoryPath: image.directoryPath,
                                                filename: image.filename
                                            },
                                            destination: {
                                                directoryPath: destinationDirectoryPath,
                                                filename: destinationFilename
                                            },
                                            hasDuplicate: !!duplicateHashLookup[image.hash]
                                        };

                                        results.push(result);

                                        // Check whether a file already exists at the destination path
                                        var existenceCheck = function () {
                                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                                    while (1) {
                                                        switch (_context.prev = _context.next) {
                                                            case 0:
                                                                _context.next = 2;
                                                                return _this._fileServices.exists(_path2.default.join(destinationDirectoryPath, destinationFilename));

                                                            case 2:
                                                                result.fileExists = _context.sent;

                                                            case 3:
                                                            case "end":
                                                                return _context.stop();
                                                        }
                                                    }
                                                }, _callee, _this);
                                            }));

                                            return function existenceCheck() {
                                                return _ref4.apply(this, arguments);
                                            };
                                        }();

                                        promises.push(existenceCheck());
                                    })();
                                }
                            };

                            _iterator2 = images, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 29:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context2.next = 32;
                                break;
                            }

                            return _context2.abrupt("break", 34);

                        case 32:
                            _context2.next = 29;
                            break;

                        case 34:
                            _context2.next = 36;
                            return Promise.all(promises);

                        case 36:
                            _context2.next = 12;
                            break;

                        case 38:
                            return _context2.abrupt("return", results);

                        case 39:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getAllImagesForMovement() {
            return _ref.apply(this, arguments);
        }

        return getAllImagesForMovement;
    }();

    PhotoMovementServices.prototype.moveImageFile = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id) {
            var image, destinationDirectoryPath, destinationFilename, currentPath, targetPath;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._photoImageDataAccess.getById(id);

                        case 2:
                            image = _context3.sent;
                            destinationDirectoryPath = getDestinationDirectoryPath(image, this._targetPhotoPath);
                            destinationFilename = getDestinationFilename(image);
                            currentPath = _path2.default.join(image.directoryPath, image.filename);
                            targetPath = _path2.default.join(destinationDirectoryPath, destinationFilename);
                            _context3.next = 9;
                            return this._fileServices.move(currentPath, targetPath);

                        case 9:
                            _context3.next = 11;
                            return this._photoImageDataAccess.updateLocation(id, destinationDirectoryPath, destinationFilename);

                        case 11:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function moveImageFile(_x) {
            return _ref5.apply(this, arguments);
        }

        return moveImageFile;
    }();

    return PhotoMovementServices;
}();

function getDestinationDirectoryPath(image, targetPhotoPath) {
    var takenMoment = (0, _moment2.default)(image.properties.takenDateTime);
    return _path2.default.join(targetPhotoPath, takenMoment.format("YYYY-MM"));
}

function getDestinationFilename(image) {
    var takenMoment = (0, _moment2.default)(image.properties.takenDateTime);
    var filenameParts = [takenMoment.format("DD HH_mm_ss"), (image.properties.camera || "").trim().toLowerCase(), image.properties.imageNumber].filter(function (p) {
        return !!p;
    });

    return filenameParts.join(" ") + _path2.default.extname(image.filename).toLowerCase();
}