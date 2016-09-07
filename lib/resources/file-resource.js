"use strict";

exports.__esModule = true;
exports.FileResource = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileResource = exports.FileResource = function () {
    function FileResource(fileServices) {
        _classCallCheck(this, FileResource);

        this._fileServices = fileServices;
    }

    FileResource.prototype.deleteFilePath = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var filePath, exists;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            filePath = ctx.params.filePath;
                            _context.next = 3;
                            return this._fileServices.exists(filePath);

                        case 3:
                            exists = _context.sent;

                            if (exists) {
                                _context.next = 7;
                                break;
                            }

                            ctx.status = 404;
                            return _context.abrupt("return");

                        case 7:
                            _context.next = 9;
                            return this._fileServices.delete(filePath);

                        case 9:
                            ctx.status = 200;

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function deleteFilePath(_x) {
            return _ref.apply(this, arguments);
        }

        return deleteFilePath;
    }();

    FileResource.prototype.deleteCriteria = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var filePath, exists;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(!ctx.query.directoryPath || !ctx.query.filename)) {
                                _context2.next = 3;
                                break;
                            }

                            ctx.status = 400;
                            return _context2.abrupt("return");

                        case 3:
                            filePath = _path2.default.join(ctx.query.directoryPath, ctx.query.filename);
                            _context2.next = 6;
                            return this._fileServices.exists(filePath);

                        case 6:
                            exists = _context2.sent;

                            if (exists) {
                                _context2.next = 10;
                                break;
                            }

                            ctx.status = 404;
                            return _context2.abrupt("return");

                        case 10:
                            _context2.next = 12;
                            return this._fileServices.delete(filePath);

                        case 12:
                            ctx.status = 200;

                        case 13:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function deleteCriteria(_x2) {
            return _ref2.apply(this, arguments);
        }

        return deleteCriteria;
    }();

    return FileResource;
}();