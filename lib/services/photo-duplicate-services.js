"use strict";

exports.__esModule = true;
exports.PhotoDuplicateServices = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDuplicateServices = exports.PhotoDuplicateServices = function () {
    function PhotoDuplicateServices(exifTool, photoImageDataAccess) {
        _classCallCheck(this, PhotoDuplicateServices);

        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
    }

    PhotoDuplicateServices.prototype.listDuplicates = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var hashes, result, resultPromises, _loop, _iterator, _isArray, _i, _ref2, _ret;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImageDataAccess.listDuplicateHashes();

                        case 2:
                            hashes = _context2.sent;
                            result = {};
                            resultPromises = [];

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref2 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref2 = _i.value;
                                }

                                var hash = _ref2;

                                var updateResult = function () {
                                    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this.getDuplicates(hash);

                                                    case 2:
                                                        result[hash] = _context.sent;

                                                    case 3:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function updateResult() {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();

                                resultPromises.push(updateResult());
                            };

                            _iterator = hashes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 7:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context2.next = 10;
                                break;
                            }

                            return _context2.abrupt("break", 12);

                        case 10:
                            _context2.next = 7;
                            break;

                        case 12:
                            _context2.next = 14;
                            return Promise.all(resultPromises);

                        case 14:
                            return _context2.abrupt("return", result);

                        case 15:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function listDuplicates() {
            return _ref.apply(this, arguments);
        }

        return listDuplicates;
    }();

    PhotoDuplicateServices.prototype.getDuplicates = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(hash) {
            var images;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._photoImageDataAccess.getByHash(hash);

                        case 2:
                            images = _context3.sent;
                            return _context3.abrupt("return", images.map(function (image) {
                                return {
                                    id: image._id,
                                    directoryPath: image.directoryPath,
                                    filename: image.filename,
                                    properties: image.properties
                                };
                            }));

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getDuplicates(_x) {
            return _ref4.apply(this, arguments);
        }

        return getDuplicates;
    }();

    PhotoDuplicateServices.prototype.resolveDuplicates = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(sameIds, differentIds) {
            var differentImages, imageNumber, directoryPathLookup, _iterator2, _isArray2, _i2, _ref6, image, filePath;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!(sameIds.length > 1)) {
                                _context4.next = 3;
                                break;
                            }

                            _context4.next = 3;
                            return this._photoImageDataAccess.combineDuplicateHistories(sameIds);

                        case 3:
                            _context4.next = 5;
                            return this._photoImageDataAccess.getByIds(differentIds);

                        case 5:
                            differentImages = _context4.sent;
                            imageNumber = 1;
                            directoryPathLookup = {};
                            _iterator2 = differentImages, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 9:
                            if (!_isArray2) {
                                _context4.next = 15;
                                break;
                            }

                            if (!(_i2 >= _iterator2.length)) {
                                _context4.next = 12;
                                break;
                            }

                            return _context4.abrupt("break", 26);

                        case 12:
                            _ref6 = _iterator2[_i2++];
                            _context4.next = 19;
                            break;

                        case 15:
                            _i2 = _iterator2.next();

                            if (!_i2.done) {
                                _context4.next = 18;
                                break;
                            }

                            return _context4.abrupt("break", 26);

                        case 18:
                            _ref6 = _i2.value;

                        case 19:
                            image = _ref6;

                            directoryPathLookup[image.directoryPath] = true;
                            filePath = _path2.default.join(image.directoryPath, image.filename);
                            _context4.next = 24;
                            return this._exifTool.setIntegerProperty(filePath, "ImageNumber", imageNumber++);

                        case 24:
                            _context4.next = 9;
                            break;

                        case 26:
                            _context4.next = 28;
                            return this._photoImageDataAccess.invalidateImageIds(differentIds);

                        case 28:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function resolveDuplicates(_x2, _x3) {
            return _ref5.apply(this, arguments);
        }

        return resolveDuplicates;
    }();

    return PhotoDuplicateServices;
}();