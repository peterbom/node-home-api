"use strict";

exports.__esModule = true;
exports.PhotoIndexResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoIndexResource = exports.PhotoIndexResource = function () {
    function PhotoIndexResource(photoIndexServices) {
        _classCallCheck(this, PhotoIndexResource);

        this._photoIndexServices = photoIndexServices;
    }

    PhotoIndexResource.prototype.listDirectories = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoIndexServices.listDirectories();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function listDirectories(_x) {
            return _ref.apply(this, arguments);
        }

        return listDirectories;
    }();

    PhotoIndexResource.prototype.compare = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var directoryPath;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            directoryPath = ctx.params.path;
                            _context2.next = 3;
                            return this._photoIndexServices.compare(directoryPath);

                        case 3:
                            ctx.body = _context2.sent;

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function compare(_x2) {
            return _ref2.apply(this, arguments);
        }

        return compare;
    }();

    PhotoIndexResource.prototype.apply = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var requestedOperation, directoryPath, ids;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            requestedOperation = ctx.request.body.operation;
                            directoryPath = ctx.request.body.directoryPath;

                            if (!directoryPath) {
                                _context3.next = 17;
                                break;
                            }

                            _context3.t0 = requestedOperation;
                            _context3.next = _context3.t0 === "invalidate" ? 6 : _context3.t0 === "index" ? 9 : _context3.t0 === "clean" ? 13 : 16;
                            break;

                        case 6:
                            _context3.next = 8;
                            return this._photoIndexServices.invalidatePath(directoryPath);

                        case 8:
                            return _context3.abrupt("break", 17);

                        case 9:
                            _context3.next = 11;
                            return this._photoIndexServices.indexPath(directoryPath, 20);

                        case 11:
                            ctx.body = _context3.sent;
                            return _context3.abrupt("break", 17);

                        case 13:
                            _context3.next = 15;
                            return this._photoIndexServices.cleanPath(directoryPath);

                        case 15:
                            return _context3.abrupt("break", 17);

                        case 16:
                            throw new Error("Unexpected operation: " + requestedOperation);

                        case 17:
                            ids = ctx.request.body.imageIds;

                            if (!(ids && ids.length)) {
                                _context3.next = 33;
                                break;
                            }

                            _context3.t1 = requestedOperation;
                            _context3.next = _context3.t1 === "invalidate" ? 22 : _context3.t1 === "index" ? 25 : _context3.t1 === "clean" ? 29 : 32;
                            break;

                        case 22:
                            _context3.next = 24;
                            return this._photoIndexServices.invalidateImageIds(ids);

                        case 24:
                            return _context3.abrupt("break", 33);

                        case 25:
                            _context3.next = 27;
                            return this._photoIndexServices.indexImageIds(ids);

                        case 27:
                            ctx.body = _context3.sent;
                            return _context3.abrupt("break", 33);

                        case 29:
                            _context3.next = 31;
                            return this._photoIndexServices.cleanImageIds(ids);

                        case 31:
                            return _context3.abrupt("break", 33);

                        case 32:
                            throw new Error("Unexpected operation: " + requestedOperation);

                        case 33:

                            ctx.status = 200;

                        case 34:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function apply(_x3) {
            return _ref3.apply(this, arguments);
        }

        return apply;
    }();

    return PhotoIndexResource;
}();