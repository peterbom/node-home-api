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

    PhotoImageServices.prototype.getById = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
            var image;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoImageDataAccess.getById(id);

                        case 2:
                            image = _context.sent;

                            if (image) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt("return", null);

                        case 5:
                            return _context.abrupt("return", toReturn([image])[0]);

                        case 6:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getById(_x) {
            return _ref.apply(this, arguments);
        }

        return getById;
    }();

    PhotoImageServices.prototype.findUnreadable = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var images;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImageDataAccess.findUnreadable();

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

        function findUnreadable() {
            return _ref2.apply(this, arguments);
        }

        return findUnreadable;
    }();

    PhotoImageServices.prototype.findMissingTakenDate = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var images;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._photoImageDataAccess.findMissingTakenDate();

                        case 2:
                            images = _context3.sent;
                            return _context3.abrupt("return", toReturn(images));

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function findMissingTakenDate() {
            return _ref3.apply(this, arguments);
        }

        return findMissingTakenDate;
    }();

    PhotoImageServices.prototype.findByCriteria = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(criteria) {
            var images;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._photoImageDataAccess.findByCriteria(criteria);

                        case 2:
                            images = _context4.sent;
                            return _context4.abrupt("return", toReturn(images));

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function findByCriteria(_x2) {
            return _ref4.apply(this, arguments);
        }

        return findByCriteria;
    }();

    PhotoImageServices.prototype.getSummaryCounts = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            var _ref6, totalCount, readableCount, requiringMovementCount;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return Promise.all([this._photoImageDataAccess.getTotalCount(), this._photoImageDataAccess.getReadableCount(), this._photoImageDataAccess.getRequiringMovementCount()]);

                        case 2:
                            _ref6 = _context5.sent;
                            totalCount = _ref6[0];
                            readableCount = _ref6[1];
                            requiringMovementCount = _ref6[2];
                            return _context5.abrupt("return", {
                                totalCount: totalCount,
                                readableCount: readableCount,
                                requiringMovementCount: requiringMovementCount
                            });

                        case 7:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function getSummaryCounts() {
            return _ref5.apply(this, arguments);
        }

        return getSummaryCounts;
    }();

    PhotoImageServices.prototype.getYearlyTotals = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return this._photoImageDataAccess.getYearlySummary();

                        case 2:
                            return _context6.abrupt("return", _context6.sent);

                        case 3:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function getYearlyTotals() {
            return _ref7.apply(this, arguments);
        }

        return getYearlyTotals;
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