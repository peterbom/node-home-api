"use strict";

exports.__esModule = true;
exports.ExifTool = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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

    ExifTool.prototype.getTags = function () {
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

                            return _context2.abrupt("return", JSON.parse(output.stdout));

                        case 8:
                            if (!output.stderr) {
                                _context2.next = 12;
                                break;
                            }

                            throw output.stderr;

                        case 12:
                            return _context2.abrupt("return", []);

                        case 13:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getTags(_x2) {
            return _ref2.apply(this, arguments);
        }

        return getTags;
    }();

    return ExifTool;
}();