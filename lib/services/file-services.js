"use strict";

exports.__esModule = true;
exports.FileServices = undefined;

var _log = require("../shared/log");

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = (0, _promisifyNode2.default)("fs");

var FileServices = exports.FileServices = function () {
    function FileServices() {
        _classCallCheck(this, FileServices);
    }

    FileServices.prototype.exists = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
            var stats;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return fs.stat(filePath);

                        case 3:
                            stats = _context.sent;
                            return _context.abrupt("return", stats && stats.isFile());

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", false);

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 7]]);
        }));

        function exists(_x) {
            return _ref.apply(this, arguments);
        }

        return exists;
    }();

    FileServices.prototype.delete = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(filePath) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return fs.unlink(filePath);

                        case 2:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function _delete(_x2) {
            return _ref2.apply(this, arguments);
        }

        return _delete;
    }();

    return FileServices;
}();