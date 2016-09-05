"use strict";

exports.__esModule = true;
exports.ExifTool = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var exec = require("child-process-promise").exec;
var timeout = 60000; // 1 minute

var ExifTool = exports.ExifTool = function () {
    function ExifTool() {
        _classCallCheck(this, ExifTool);

        this._toolPath = _path2.default.join(__dirname, "../../exiftool/exiftool.pl");
    }

    ExifTool.prototype.getThumbnail = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
            var command, output;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            command = "perl " + this._toolPath + " -b -ThumbnailImage \"" + filePath + "\"";
                            _context.next = 3;
                            return exec(command, {
                                encoding: "binary",
                                maxBuffer: 100 * 1024,
                                timeout: timeout
                            });

                        case 3:
                            output = _context.sent;

                            if (!output.stdout) {
                                _context.next = 8;
                                break;
                            }

                            return _context.abrupt("return", new Buffer(output.stdout, "binary"));

                        case 8:
                            if (!output.stderr) {
                                _context.next = 12;
                                break;
                            }

                            throw output.stderr;

                        case 12:
                            return _context.abrupt("return", null);

                        case 13:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getThumbnail(_x) {
            return _ref.apply(this, arguments);
        }

        return getThumbnail;
    }();

    ExifTool.prototype.getAllTags = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(filePath) {
            var command, output;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            command = "perl " + this._toolPath + " -s -a -j \"" + filePath + "\"";
                            _context2.next = 3;
                            return exec(command, { timeout: timeout });

                        case 3:
                            output = _context2.sent;

                            if (!output.stdout) {
                                _context2.next = 8;
                                break;
                            }

                            return _context2.abrupt("return", JSON.parse(output.stdout)[0]);

                        case 8:
                            if (!output.stderr) {
                                _context2.next = 12;
                                break;
                            }

                            throw output.stderr;

                        case 12:
                            return _context2.abrupt("return", {});

                        case 13:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getAllTags(_x2) {
            return _ref2.apply(this, arguments);
        }

        return getAllTags;
    }();

    ExifTool.prototype.getProperties = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            for (var _len = arguments.length, filePaths = Array(_len), _key = 0; _key < _len; _key++) {
                filePaths[_key] = arguments[_key];
            }

            var properties, pathArgs, command, infos, output, results, _loop, _iterator, _isArray, _i, _ref4, _ret;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            properties = ["-DateTimeOriginal", "-CreateDate", "-DateTime1", "-DateTime2", "-MediaCreateDate", "-FileCreateDate", "-FileModifyDate", "-Make", "-Model", "-Software", "-CreatorTool", "-FileName", "-FileType", "-FileSize", "-ImageWidth", "-ImageHeight", "-ImageNumber", "-Subject", "-Keywords"];
                            pathArgs = filePaths.map(function (p) {
                                return "\"" + p + "\"";
                            }).join(" ");
                            command = "perl " + this._toolPath + " -s -j " + properties.join(" ") + " " + pathArgs;
                            infos = [];
                            _context3.prev = 4;
                            _context3.next = 7;
                            return exec(command, { timeout: timeout });

                        case 7:
                            output = _context3.sent;

                            if (output.stdout) {
                                _context3.next = 12;
                                break;
                            }

                            if (!output.stderr) {
                                _context3.next = 11;
                                break;
                            }

                            throw output.stderr;

                        case 11:
                            return _context3.abrupt("return", null);

                        case 12:

                            infos = JSON.parse(output.stdout);
                            _context3.next = 18;
                            break;

                        case 15:
                            _context3.prev = 15;
                            _context3.t0 = _context3["catch"](4);
                            return _context3.abrupt("return", null);

                        case 18:
                            results = {};

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref4 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref4 = _i.value;
                                }

                                var info = _ref4;

                                var takenDateTime = null;
                                ["DateTimeOriginal", "CreateDate", "MediaCreateDate", "DateTime1", "DateTime2"].forEach(function (prop) {
                                    takenDateTime = takenDateTime || tryGetDate(info[prop]);
                                });

                                var fileModifyDate = tryGetDate(info.FileModifyDate);
                                var fileCreateDate = tryGetDate(info.FileCreateDate);

                                var camera = ((info.Make || "") + " " + (info.Model || "")).trim() || info.Software || info.CreatorTool;

                                var tags = [];
                                if (info.Subject) {
                                    if (typeof info.Subject === 'string') {
                                        tags = tags.concat(info.Subject.split(","));
                                    } else {
                                        tags = tags.concat(info.Subject);
                                    }
                                }

                                var keywordTags = [];
                                if (info.Keywords) {
                                    if (typeof info.Keywords === 'string') {
                                        keywordTags = keywordTags.concat(info.Keywords.split(","));
                                    } else {
                                        keywordTags = keywordTags.concat(info.Keywords);
                                    }
                                }

                                for (var i = 0; i < keywordTags.length; i++) {
                                    var keyword = keywordTags[i];
                                    if (tags.indexOf(keyword) === -1) {
                                        tags.push(keyword);
                                    }
                                }

                                results[info.FileName] = {
                                    takenDateTime: takenDateTime,
                                    fileModifyDate: fileModifyDate,
                                    fileCreateDate: fileCreateDate,
                                    fileSize: info.FileSize,
                                    camera: camera,
                                    tags: tags,
                                    pixelCount: info.ImageWidth * info.ImageHeight,
                                    imageNumber: info.imageNumber || 0,
                                    fileType: info.FileType
                                };
                            };

                            _iterator = infos, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 21:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context3.next = 24;
                                break;
                            }

                            return _context3.abrupt("break", 26);

                        case 24:
                            _context3.next = 21;
                            break;

                        case 26:
                            return _context3.abrupt("return", results);

                        case 27:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[4, 15]]);
        }));

        function getProperties(_x3) {
            return _ref3.apply(this, arguments);
        }

        return getProperties;
    }();

    ExifTool.prototype.setImageNumber = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(filePath, imageNumber) {
            var command;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            // TODO: Consider whether to add -overwrite_original_in_place flag.
                            // http://www.sno.phy.queensu.ca/~phil/exiftool/exiftool_pod.html
                            command = "perl " + this._toolPath + " -ImageNumber=" + imageNumber + " \"" + filePath + "\"";
                            _context4.next = 3;
                            return exec(command, { timeout: timeout });

                        case 3:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function setImageNumber(_x4, _x5) {
            return _ref5.apply(this, arguments);
        }

        return setImageNumber;
    }();

    return ExifTool;
}();

function tryGetDate(stringValue) {
    if (stringValue) {
        var time = (0, _moment2.default)(stringValue, "YYYY:MM:DD HH:mm:ssZ");
        if (time && time.year() > 1970 && time.year() <= (0, _moment2.default)().year()) {
            return time.toDate();
        }
    }

    return null;
}