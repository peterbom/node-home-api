"use strict";

exports.__esModule = true;
exports.PhotoExifDataServices = undefined;

var imagesToExifData = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(exifTool, images, includeAll, includeThumbnails) {
        var filePaths, results, allTags, i, imageId, thumbnails, _i, _imageId;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        filePaths = images.map(function (i) {
                            return _path2.default.join(i.directoryPath, i.filename);
                        });
                        results = {};

                        images.forEach(function (i) {
                            return results[i._id] = {};
                        });

                        if (!includeAll) {
                            _context4.next = 8;
                            break;
                        }

                        _context4.next = 6;
                        return exifTool.getAllTags.apply(exifTool, filePaths);

                    case 6:
                        allTags = _context4.sent;

                        for (i = 0; i < images.length; i++) {
                            imageId = images[i]._id;

                            Object.assign(results[imageId], allTags[i]);
                        }

                    case 8:
                        if (!includeThumbnails) {
                            _context4.next = 13;
                            break;
                        }

                        _context4.next = 11;
                        return exifTool.getThumbnails.apply(exifTool, filePaths);

                    case 11:
                        thumbnails = _context4.sent;

                        for (_i = 0; _i < images.length; _i++) {
                            _imageId = images[_i]._id;

                            Object.assign(results[_imageId], thumbnails[_i]);
                        }

                    case 13:
                        return _context4.abrupt("return", results);

                    case 14:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function imagesToExifData(_x10, _x11, _x12, _x13) {
        return _ref4.apply(this, arguments);
    };
}();

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoExifDataServices = exports.PhotoExifDataServices = function () {
    function PhotoExifDataServices(exifTool, photoImageDataAccess) {
        _classCallCheck(this, PhotoExifDataServices);

        this._exifTool = exifTool;
        this._photoImageDataAccess = photoImageDataAccess;
    }

    PhotoExifDataServices.prototype.getByImageId = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id, includeAll, includeThumbnails) {
            var image, lookup;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoImageDataAccess.getById(id);

                        case 2:
                            image = _context.sent;
                            _context.next = 5;
                            return imagesToExifData(this._exifTool, [image], includeAll, includeThumbnails);

                        case 5:
                            lookup = _context.sent;
                            return _context.abrupt("return", lookup[image._id]);

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getByImageId(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return getByImageId;
    }();

    PhotoExifDataServices.prototype.getByImageIds = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ids, includeAll, includeThumbnails) {
            var images;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImageDataAccess.getByIds(ids);

                        case 2:
                            images = _context2.sent;
                            _context2.next = 5;
                            return imagesToExifData(this._exifTool, images, includeAll, includeThumbnails);

                        case 5:
                            return _context2.abrupt("return", _context2.sent);

                        case 6:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getByImageIds(_x4, _x5, _x6) {
            return _ref2.apply(this, arguments);
        }

        return getByImageIds;
    }();

    PhotoExifDataServices.prototype.getByImageHash = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(hash, includeAll, includeThumbnails) {
            var images;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._photoImageDataAccess.getByHash(hash);

                        case 2:
                            images = _context3.sent;
                            _context3.next = 5;
                            return imagesToExifData(this._exifTool, images, includeAll, includeThumbnails);

                        case 5:
                            return _context3.abrupt("return", _context3.sent);

                        case 6:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getByImageHash(_x7, _x8, _x9) {
            return _ref3.apply(this, arguments);
        }

        return getByImageHash;
    }();

    return PhotoExifDataServices;
}();