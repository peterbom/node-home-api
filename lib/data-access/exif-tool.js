"use strict";

exports.__esModule = true;
exports.ExifTool = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var exec = require("child-process-promise").exec;

var ExifTool = exports.ExifTool = function () {
    function ExifTool() {
        _classCallCheck(this, ExifTool);

        this._toolPath = _path2.default.join(__dirname, "../../exiftool/exiftool.pl");
    }

    ExifTool.prototype.getImageData = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            return _context.abrupt("return", {});

                        case 1:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getImageData(_x) {
            return _ref.apply(this, arguments);
        }

        return getImageData;
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
                            return exec(command);

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

            var properties, pathArgs, command, output, results, infos, _iterator, _isArray, _i, _ref4, info, takenDateTimeString, takenDateTime, fileModifyDate, camera, tags, keywordTags, i, keyword;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            properties = ["-DateTimeOriginal", "-CreateDate", "-DateTime1", "-DateTime2", "-MediaCreateDate", "-FileModifyDate", "-Make", "-Model", "-Software", "-CreatorTool", "-FileName", "-FileType", "-FileSize", "-ImageWidth", "-ImageHeight", "-Subject", "-Keywords"];
                            pathArgs = filePaths.map(function (p) {
                                return "\"" + p + "\"";
                            }).join(" ");
                            command = "perl " + this._toolPath + " -s -j " + properties.join(" ") + " " + pathArgs;
                            _context3.next = 5;
                            return exec(command);

                        case 5:
                            output = _context3.sent;

                            if (output.stdout) {
                                _context3.next = 10;
                                break;
                            }

                            if (!output.stderr) {
                                _context3.next = 9;
                                break;
                            }

                            throw output.stderr;

                        case 9:
                            return _context3.abrupt("return", {});

                        case 10:
                            results = {};
                            infos = JSON.parse(output.stdout);
                            _iterator = infos, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 13:
                            if (!_isArray) {
                                _context3.next = 19;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context3.next = 16;
                                break;
                            }

                            return _context3.abrupt("break", 38);

                        case 16:
                            _ref4 = _iterator[_i++];
                            _context3.next = 23;
                            break;

                        case 19:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context3.next = 22;
                                break;
                            }

                            return _context3.abrupt("break", 38);

                        case 22:
                            _ref4 = _i.value;

                        case 23:
                            info = _ref4;
                            takenDateTimeString = info.DateTimeOriginal || info.CreateDate || info.MediaCreateDate || info.DateTime1 || info.DateTime2;
                            takenDateTime = void 0;

                            if (takenDateTimeString) {
                                takenDateTime = (0, _moment2.default)(takenDateTimeString, "YYYY:MM:DD HH:mm:ssZ").toDate();
                            }

                            fileModifyDate = void 0;

                            if (info.FileModifyDate) {
                                fileModifyDate = (0, _moment2.default)(info.FileModifyDate, "YYYY:MM:DD HH:mm:ssZ").toDate();
                            }

                            camera = ((info.Make || "") + " " + (info.Model || "")).trim() || info.Software || info.CreatorTool;
                            tags = [];

                            if (info.Subject) {
                                if (typeof info.Subject === 'string') {
                                    tags = tags.concat(info.Subject.split(","));
                                } else {
                                    tags = tags.concat(info.Subject);
                                }
                            }

                            keywordTags = [];

                            if (info.Keywords) {
                                if (typeof info.Keywords === 'string') {
                                    keywordTags = keywordTags.concat(info.Keywords.split(","));
                                } else {
                                    keywordTags = keywordTags.concat(info.Keywords);
                                }
                            }

                            for (i = 0; i < keywordTags.length; i++) {
                                keyword = keywordTags[i];

                                if (tags.indexOf(keyword) === -1) {
                                    tags.push(keyword);
                                }
                            }

                            results[info.FileName] = {
                                takenDateTime: takenDateTime,
                                fileModifyDate: fileModifyDate,
                                fileSize: info.FileSize,
                                camera: camera,
                                tags: tags,
                                pixelCount: info.ImageWidth * info.ImageHeight,
                                fileType: info.FileType
                            };

                        case 36:
                            _context3.next = 13;
                            break;

                        case 38:
                            return _context3.abrupt("return", results);

                        case 39:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getProperties(_x3) {
            return _ref3.apply(this, arguments);
        }

        return getProperties;
    }();

    return ExifTool;
}();