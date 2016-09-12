"use strict";

exports.__esModule = true;
exports.PhotoUploadServices = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mkdirp = (0, _promisifyNode2.default)("mkdirp");
var fs = (0, _promisifyNode2.default)("fs");

var PhotoUploadServices = exports.PhotoUploadServices = function () {
    function PhotoUploadServices(photoUploadDataAccess, stagingPhotoPath) {
        _classCallCheck(this, PhotoUploadServices);

        this._photoUploadDataAccess = photoUploadDataAccess;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    PhotoUploadServices.prototype.create = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var directoryName, directoryPath;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            directoryName = "upload " + (0, _moment2.default)().format("YYYY-MM-DD HH_mm_ss");
                            directoryPath = _path2.default.join(this._stagingPhotoPath, directoryName);
                            _context.next = 4;
                            return mkdirp(directoryPath);

                        case 4:
                            _context.next = 6;
                            return this._photoUploadDataAccess.create(directoryPath);

                        case 6:
                            return _context.abrupt("return", _context.sent);

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function create() {
            return _ref.apply(this, arguments);
        }

        return create;
    }();

    PhotoUploadServices.prototype.getUpload = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoUploadDataAccess.getById(id);

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getUpload(_x) {
            return _ref2.apply(this, arguments);
        }

        return getUpload;
    }();

    PhotoUploadServices.prototype.addFile = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(upload, filename, readStream) {
            var writeStream;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            writeStream = fs.createWriteStream(_path2.default.join(upload.directoryPath, filename));

                            readStream.pipe(writeStream);

                            _context3.next = 4;
                            return new Promise(function (fulfill, reject) {
                                writeStream.on("error", function (err) {
                                    reject(err);
                                });

                                writeStream.on("finish", function () {
                                    fulfill();
                                });
                            });

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function addFile(_x2, _x3, _x4) {
            return _ref3.apply(this, arguments);
        }

        return addFile;
    }();

    return PhotoUploadServices;
}();