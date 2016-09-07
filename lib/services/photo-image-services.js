"use strict";

exports.__esModule = true;
exports.PhotoImageServices = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoImageServices = exports.PhotoImageServices = function () {
    function PhotoImageServices(photoImageDataAccess) {
        _classCallCheck(this, PhotoImageServices);

        this._photoImageDataAccess = photoImageDataAccess;
    }

    PhotoImageServices.prototype.findUnreadable = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var images;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoImageDataAccess.findUnreadable();

                        case 2:
                            images = _context.sent;
                            return _context.abrupt("return", toReturn(images));

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findUnreadable() {
            return _ref.apply(this, arguments);
        }

        return findUnreadable;
    }();

    PhotoImageServices.prototype.findMissingTakenDate = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var images;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImageDataAccess.findMissingTakenDate();

                        case 2:
                            images = _context2.sent;
                            return _context2.abrupt("return", toReturn(images));

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function findMissingTakenDate() {
            return _ref2.apply(this, arguments);
        }

        return findMissingTakenDate;
    }();

    return PhotoImageServices;
}();

function toReturn(images) {
    return images.map(function (image) {
        return {
            id: image._id,
            directoryPath: image.directoryPath,
            filename: image.filename,
            hash: image.hash,
            takenDateTime: image.properties && image.properties.takenDateTime,
            fileModifyDate: image.properties && image.properties.fileModifyDate,
            fileCreateDate: image.properties && image.properties.fileCreateDate,
            fileSize: image.properties && image.properties.fileSize,
            camera: image.properties && image.properties.camera,
            tags: image.properties && image.properties.tags,
            pixelCount: image.properties && image.properties.pixelCount,
            imageNumber: image.properties && image.properties.imageNumber,
            fileType: image.properties && image.properties.fileType,
            pathHistory: image.pathHistory
        };
    });
}