"use strict";

exports.__esModule = true;
exports.PhotoDuplicateServices = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDuplicateServices = exports.PhotoDuplicateServices = function () {
    function PhotoDuplicateServices(exifTool, imageDataAccess) {
        _classCallCheck(this, PhotoDuplicateServices);

        this._exifTool = exifTool;
        this._imageDataAccess = imageDataAccess;
    }

    PhotoDuplicateServices.prototype.getDuplicates = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._imageDataAccess.getDuplicates();

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getDuplicates() {
            return _ref.apply(this, arguments);
        }

        return getDuplicates;
    }();

    PhotoDuplicateServices.prototype.resolveDuplicates = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(sameIds, differentIds) {
            var _this = this;

            var differentImages, imageNumber, directoryPathLookup, _iterator, _isArray, _i, _ref3, image, filePath;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(sameIds.length > 1)) {
                                _context2.next = 3;
                                break;
                            }

                            _context2.next = 3;
                            return this._imageDataAccess.combineDuplicateHistories(sameIds);

                        case 3:
                            _context2.next = 5;
                            return Promise.all(differentIds.map(function (id) {
                                return _this._imageDataAccess.getById(id);
                            }));

                        case 5:
                            differentImages = _context2.sent;
                            imageNumber = 1;
                            directoryPathLookup = {};
                            _iterator = differentImages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 9:
                            if (!_isArray) {
                                _context2.next = 15;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context2.next = 12;
                                break;
                            }

                            return _context2.abrupt("break", 28);

                        case 12:
                            _ref3 = _iterator[_i++];
                            _context2.next = 19;
                            break;

                        case 15:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context2.next = 18;
                                break;
                            }

                            return _context2.abrupt("break", 28);

                        case 18:
                            _ref3 = _i.value;

                        case 19:
                            image = _ref3;

                            directoryPathLookup[image.directoryPath] = true;
                            filePath = path.join(image.directoryPath, image.filename);
                            _context2.next = 24;
                            return this._exifTool.setImageNumber(filePath, imageNumber++);

                        case 24:
                            _context2.next = 26;
                            return this._imageDataAccess.invalidateImage(image.directoryPath, image.filename);

                        case 26:
                            _context2.next = 9;
                            break;

                        case 28:
                            _context2.t0 = regeneratorRuntime.keys(directoryPathLookup);

                        case 29:
                            if ((_context2.t1 = _context2.t0()).done) {
                                _context2.next = 35;
                                break;
                            }

                            directoryPath = _context2.t1.value;
                            _context2.next = 33;
                            return this.index(directoryPath, 100);

                        case 33:
                            _context2.next = 29;
                            break;

                        case 35:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function resolveDuplicates(_x, _x2) {
            return _ref2.apply(this, arguments);
        }

        return resolveDuplicates;
    }();

    return PhotoDuplicateServices;
}();