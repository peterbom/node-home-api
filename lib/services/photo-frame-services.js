"use strict";

exports.__esModule = true;
exports.PhotoFrameServices = undefined;

var _log = require("../shared/log");

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = (0, _promisifyNode2.default)("fs");

var PhotoFrameServices = exports.PhotoFrameServices = function () {
    function PhotoFrameServices(photoImageDataAccess, ipAddress) {
        _classCallCheck(this, PhotoFrameServices);

        this._photoImageDataAccess = photoImageDataAccess;
        this._ipAddress = ipAddress;
    }

    PhotoFrameServices.prototype.list = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var files, ids, images;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this.getAllFiles();

                        case 2:
                            files = _context.sent;
                            ids = files.map(function (f) {
                                return _path2.default.basename(f, _path2.default.extname(f));
                            });
                            _context.next = 6;
                            return this._photoImageDataAccess.getByIds(ids, true);

                        case 6:
                            images = _context.sent;
                            return _context.abrupt("return", images.map(function (i) {
                                return i._id;
                            }));

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function list() {
            return _ref.apply(this, arguments);
        }

        return list;
    }();

    PhotoFrameServices.prototype.addImages = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ids) {
            var _this = this;

            var files, images, existingFilenameSet, imageFilenames, imageFilesToAdd, _iterator, _isArray, _i, _ref3, imageFile;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this.setUploadDirectory("/");

                        case 2:
                            _context2.next = 4;
                            return this.getAllFiles();

                        case 4:
                            files = _context2.sent;
                            _context2.next = 7;
                            return this._photoImageDataAccess.getByIds(ids);

                        case 7:
                            images = _context2.sent;
                            existingFilenameSet = new Set(files);
                            imageFilenames = images.map(function (i) {
                                return {
                                    image: i,
                                    targetFilename: _this.getTargetFilename(i)
                                };
                            });
                            imageFilesToAdd = imageFilenames.filter(function (i) {
                                return !existingFilenameSet.has(i.targetFilename);
                            });

                            // Upload files serially. Attempting to do it in parallel seems to cause
                            // the server to hang.

                            _iterator = imageFilesToAdd, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 12:
                            if (!_isArray) {
                                _context2.next = 18;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context2.next = 15;
                                break;
                            }

                            return _context2.abrupt("break", 27);

                        case 15:
                            _ref3 = _iterator[_i++];
                            _context2.next = 22;
                            break;

                        case 18:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context2.next = 21;
                                break;
                            }

                            return _context2.abrupt("break", 27);

                        case 21:
                            _ref3 = _i.value;

                        case 22:
                            imageFile = _ref3;
                            _context2.next = 25;
                            return this.uploadFile(imageFile.image, imageFile.targetFilename);

                        case 25:
                            _context2.next = 12;
                            break;

                        case 27:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function addImages(_x) {
            return _ref2.apply(this, arguments);
        }

        return addImages;
    }();

    PhotoFrameServices.prototype.clearImages = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var _this2 = this;

            var files;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this.getAllFiles();

                        case 2:
                            files = _context3.sent;
                            _context3.next = 5;
                            return Promise.all(files.map(function (f) {
                                return _this2.deleteFile(f);
                            }));

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function clearImages() {
            return _ref4.apply(this, arguments);
        }

        return clearImages;
    }();

    PhotoFrameServices.prototype.setUploadDirectory = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(dir) {
            var url, options;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            url = "http://" + this._ipAddress + "/upload.cgi?UPDIR=/";
                            options = {
                                uri: url,
                                json: false
                            };
                            _context4.next = 4;
                            return (0, _requestPromise2.default)(options);

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function setUploadDirectory(_x2) {
            return _ref5.apply(this, arguments);
        }

        return setUploadDirectory;
    }();

    PhotoFrameServices.prototype.getAllFiles = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            var url, options, resultText, lines, fileRegex, files, _iterator2, _isArray2, _i2, _ref7, line, match, filename, attributes;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            url = "http://" + this._ipAddress + "/command.cgi?op=100&DIR=/";
                            options = {
                                uri: url,
                                json: false
                            };
                            _context5.next = 4;
                            return (0, _requestPromise2.default)(options);

                        case 4:
                            resultText = _context5.sent;
                            lines = resultText.match(/[^\r\n]+/g);

                            // <directory>, <filename>, <size>, <attribute>, <date>, <time>
                            // Notes:
                            // - directory can be empty
                            // - filename can contain commas
                            // - attribute consists of:
                            //   - Bit 5   Archive      mask 32
                            //   - Bit 4   Directly     mask 16 (think it means 'directory')
                            //   - Bit 3   Volume       mask 8
                            //   - Bit 2   System file  mask 4
                            //   - Bit 1   Hidden file  mask 2
                            //   - Bit 0   Read only    mask 1

                            fileRegex = /[!,]*,(.+),\d+,(\d+),\d+,\d+/;
                            files = [];
                            _iterator2 = lines, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 9:
                            if (!_isArray2) {
                                _context5.next = 15;
                                break;
                            }

                            if (!(_i2 >= _iterator2.length)) {
                                _context5.next = 12;
                                break;
                            }

                            return _context5.abrupt("break", 24);

                        case 12:
                            _ref7 = _iterator2[_i2++];
                            _context5.next = 19;
                            break;

                        case 15:
                            _i2 = _iterator2.next();

                            if (!_i2.done) {
                                _context5.next = 18;
                                break;
                            }

                            return _context5.abrupt("break", 24);

                        case 18:
                            _ref7 = _i2.value;

                        case 19:
                            line = _ref7;
                            match = fileRegex.exec(line);

                            if (match) {
                                filename = match[1];
                                attributes = Number.parseInt(match[2]);
                                // Check it has attributes and is not a directory

                                if (attributes && !(attributes & 16)) {
                                    files.push(filename);
                                }
                            }

                        case 22:
                            _context5.next = 9;
                            break;

                        case 24:
                            return _context5.abrupt("return", files);

                        case 25:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function getAllFiles() {
            return _ref6.apply(this, arguments);
        }

        return getAllFiles;
    }();

    PhotoFrameServices.prototype.deleteFile = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(filename) {
            var url, options;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            url = "http://" + this._ipAddress + "/upload.cgi?DEL=/" + filename;
                            options = {
                                uri: url,
                                json: false
                            };
                            _context6.next = 4;
                            return (0, _requestPromise2.default)(options);

                        case 4:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function deleteFile(_x3) {
            return _ref8.apply(this, arguments);
        }

        return deleteFile;
    }();

    PhotoFrameServices.prototype.getTargetFilename = function getTargetFilename(image) {
        return image._id + _path2.default.extname(image.filename);
    };

    PhotoFrameServices.prototype.uploadFile = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(image, targetFilename) {
            var sourceFilePath, url, resolver, promise, options;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            sourceFilePath = _path2.default.join(image.directoryPath, image.filename);
                            url = "http://" + this._ipAddress + "/upload.cgi";

                            // Don't use the promise library here:
                            // "STREAMING THE RESPONSE (e.g. .pipe(...)) is DISCOURAGED because Request-Promise
                            // would grow the memory footprint for large requests unnecessarily high. Use the
                            // original Request library for that"

                            resolver = {};
                            promise = new Promise(function (fulfill, reject) {
                                resolver.fulfill = fulfill;
                                resolver.reject = reject;
                            });
                            options = {
                                method: "POST",
                                url: url,
                                formData: {
                                    file: {
                                        value: fs.createReadStream(sourceFilePath),
                                        options: {
                                            filename: targetFilename
                                        }
                                    }
                                },
                                callback: function callback(error, response, body) {
                                    if (error) {
                                        resolver.reject(error);
                                    } else {
                                        resolver.fulfill(body);
                                    }
                                }
                            };


                            _request2.default.post(options);

                            _context7.next = 8;
                            return promise;

                        case 8:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function uploadFile(_x4, _x5) {
            return _ref9.apply(this, arguments);
        }

        return uploadFile;
    }();

    return PhotoFrameServices;
}();