"use strict";

exports.__esModule = true;
exports.ImageDataAccess = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageDataAccess = exports.ImageDataAccess = function () {
    function ImageDataAccess(dbManager) {
        _classCallCheck(this, ImageDataAccess);

        this._imageInfos = dbManager.get("imageInfos");
        this._imageInfos.ensureIndex({ "directoryPath": 1, "filename": 1 });
        this._imageInfos.ensureIndex({ "hash": 1 });
    }

    ImageDataAccess.prototype.getDiff = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(directoryPath, filenames) {
            var indexedResults, result, filenameLookup, indexedFilenameLookup, filename, _filename;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });

                            _context.next = 4;
                            return this._imageInfos.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 4:
                            indexedResults = _context.sent;
                            result = {
                                new: [],
                                deleted: []
                            };

                            if (!(indexedResults.length === 0)) {
                                _context.next = 9;
                                break;
                            }

                            result.new = filenames;
                            return _context.abrupt("return", result);

                        case 9:
                            filenameLookup = {};

                            filenames.forEach(function (f) {
                                return filenameLookup[f] = true;
                            });

                            indexedFilenameLookup = {};

                            indexedResults.forEach(function (m) {
                                return indexedFilenameLookup[m.filename] = true;
                            });

                            for (filename in filenameLookup) {
                                if (!indexedFilenameLookup[filename]) {
                                    result.new.push(filename);
                                }
                            }

                            for (_filename in indexedFilenameLookup) {
                                if (!filenameLookup[_filename]) {
                                    result.deleted.push(_filename);
                                }
                            }

                            return _context.abrupt("return", result);

                        case 16:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getDiff(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return getDiff;
    }();

    ImageDataAccess.prototype.getIndexedDirectories = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var groups;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._imageInfos.aggregate({ $group: { _id: "$directoryPath", count: { $sum: 1 } } });

                        case 2:
                            groups = _context2.sent;
                            return _context2.abrupt("return", groups.map(function (g) {
                                return {
                                    directoryPath: g._id,
                                    imageCount: g.count
                                };
                            }));

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getIndexedDirectories() {
            return _ref2.apply(this, arguments);
        }

        return getIndexedDirectories;
    }();

    ImageDataAccess.prototype.getImageFilenames = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directoryPath) {
            var images;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            _context3.next = 3;
                            return this._imageInfos.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 3:
                            images = _context3.sent;
                            return _context3.abrupt("return", images.map(function (i) {
                                return i.filename;
                            }));

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getImageFilenames(_x3) {
            return _ref3.apply(this, arguments);
        }

        return getImageFilenames;
    }();

    ImageDataAccess.prototype.cleanExcept = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(directoryPath, filenames) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });
                            _context4.next = 4;
                            return this._imageInfos.remove({ directoryPath: directoryPath, filename: { $nin: filenames } });

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function cleanExcept(_x4, _x5) {
            return _ref4.apply(this, arguments);
        }

        return cleanExcept;
    }();

    ImageDataAccess.prototype.invalidateImages = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(directoryPath) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            _context5.next = 3;
                            return this._imageInfos.update({ directoryPath: directoryPath }, { $set: { valid: false } }, { multi: true });

                        case 3:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function invalidateImages(_x6) {
            return _ref5.apply(this, arguments);
        }

        return invalidateImages;
    }();

    ImageDataAccess.prototype.upsertImage = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(directoryPath, filename, imageProperties /* Can be null */) {
            var image;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            image = {
                                directoryPath: directoryPath.toLowerCase(),
                                filename: filename.toLowerCase(),
                                hash: getImageHash(imageProperties),
                                properties: imageProperties,
                                valid: true
                            };
                            _context6.next = 3;
                            return this._imageInfos.findOneAndUpdate({ directoryPath: image.directoryPath, filename: image.filename }, { $set: image }, { upsert: true });

                        case 3:
                            image = _context6.sent;

                            if (image.pathHistory) {
                                _context6.next = 9;
                                break;
                            }

                            image.pathHistory = [{
                                date: new Date(),
                                filePath: _path2.default.join(image.directoryPath, image.filename)
                            }];

                            _context6.next = 8;
                            return this._imageInfos.update({ _id: image._id }, image);

                        case 8:
                            image = _context6.sent;

                        case 9:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function upsertImage(_x7, _x8, _x9) {
            return _ref6.apply(this, arguments);
        }

        return upsertImage;
    }();

    return ImageDataAccess;
}();

function getImageHash(imageProperties) {
    if (!imageProperties) {
        return null;
    }

    var identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime || imageProperties.fileModifyDate,
        pixels: imageProperties.pixelCount
    };

    return (0, _md2.default)(JSON.stringify(identifiers));
}