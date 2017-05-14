"use strict";

exports.__esModule = true;
exports.PhotoMovementServices = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoMovementServices = exports.PhotoMovementServices = function () {
    function PhotoMovementServices(photoImageDataAccess, fileServices, sshServices, imageUtils) {
        _classCallCheck(this, PhotoMovementServices);

        this._photoImageDataAccess = photoImageDataAccess;
        this._sshServices = sshServices;
        this._fileServices = fileServices;
        this._imageUtils = imageUtils;
    }

    PhotoMovementServices.prototype.getDirectoryPathsForMovement = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoImageDataAccess.findPathsRequiringMovement();

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getDirectoryPathsForMovement() {
            return _ref.apply(this, arguments);
        }

        return getDirectoryPathsForMovement;
    }();

    PhotoMovementServices.prototype.getImagesToMove = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directoryPath) {
            var _this = this;

            var duplicateHashes, images, results, promises, _loop, _iterator, _isArray, _i, _ref3, _ret;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.t0 = Set;
                            _context3.next = 3;
                            return this._photoImageDataAccess.listDuplicateHashes();

                        case 3:
                            _context3.t1 = _context3.sent;
                            duplicateHashes = new _context3.t0(_context3.t1);
                            _context3.next = 7;
                            return this._photoImageDataAccess.findImagesRequiringMovement(directoryPath);

                        case 7:
                            images = _context3.sent;
                            results = [];
                            promises = [];

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref3 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref3 = _i.value;
                                }

                                var image = _ref3;

                                var destinationDirectoryPath = _this._imageUtils.getDestinationDirectoryPath(image.properties);
                                var destinationFilename = _this._imageUtils.getDestinationFilename(image.properties, image.filename);

                                if (destinationDirectoryPath !== image.directoryPath || destinationFilename !== image.filename) {
                                    (function () {
                                        var result = {
                                            id: image._id,
                                            hash: image.hash,
                                            current: {
                                                directoryPath: image.directoryPath,
                                                filename: image.filename
                                            },
                                            destination: {
                                                directoryPath: destinationDirectoryPath,
                                                filename: destinationFilename
                                            },
                                            hasDuplicate: duplicateHashes.has(image.hash)
                                        };

                                        results.push(result);

                                        // Check whether a file already exists at the destination path
                                        var existenceCheck = function () {
                                            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                    while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                            case 0:
                                                                _context2.next = 2;
                                                                return _this._fileServices.exists(_path2.default.join(destinationDirectoryPath, destinationFilename));

                                                            case 2:
                                                                result.fileExists = _context2.sent;

                                                            case 3:
                                                            case "end":
                                                                return _context2.stop();
                                                        }
                                                    }
                                                }, _callee2, _this);
                                            }));

                                            return function existenceCheck() {
                                                return _ref4.apply(this, arguments);
                                            };
                                        }();

                                        promises.push(existenceCheck());
                                    })();
                                }
                            };

                            _iterator = images, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 12:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context3.next = 15;
                                break;
                            }

                            return _context3.abrupt("break", 17);

                        case 15:
                            _context3.next = 12;
                            break;

                        case 17:
                            _context3.next = 19;
                            return Promise.all(promises);

                        case 19:
                            return _context3.abrupt("return", results);

                        case 20:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getImagesToMove(_x) {
            return _ref2.apply(this, arguments);
        }

        return getImagesToMove;
    }();

    PhotoMovementServices.prototype.moveImageFile = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(id) {
            var image, destinationDirectoryPath, destinationFilename, currentPath, targetPath;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._photoImageDataAccess.getById(id);

                        case 2:
                            image = _context4.sent;
                            destinationDirectoryPath = this._imageUtils.getDestinationDirectoryPath(image.properties);
                            destinationFilename = this._imageUtils.getDestinationFilename(image.properties, image.filename);
                            currentPath = _path2.default.join(image.directoryPath, image.filename);
                            targetPath = _path2.default.join(destinationDirectoryPath, destinationFilename);
                            _context4.next = 9;
                            return this._sshServices.moveServerFiles(currentPath, targetPath);

                        case 9:
                            _context4.next = 11;
                            return this._photoImageDataAccess.updateLocation(id, destinationDirectoryPath, destinationFilename);

                        case 11:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function moveImageFile(_x2) {
            return _ref5.apply(this, arguments);
        }

        return moveImageFile;
    }();

    return PhotoMovementServices;
}();