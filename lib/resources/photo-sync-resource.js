"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoSyncResource = exports.PhotoSyncResource = function () {
    function PhotoSyncResource(photoSyncServices) {
        _classCallCheck(this, PhotoSyncResource);

        this._photoSyncServices = photoSyncServices;
    }

    PhotoSyncResource.prototype.compare = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoSyncServices.compare();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function compare(_x) {
            return _ref.apply(this, arguments);
        }

        return compare;
    }();

    PhotoSyncResource.prototype.update = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var directoryPath, requestedOperation;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            directoryPath = decodeURIComponent(ctx.params.id);
                            requestedOperation = ctx.request.body.operation;
                            _context2.t0 = requestedOperation;
                            _context2.next = _context2.t0 === "invalidate" ? 5 : _context2.t0 === "index" ? 8 : _context2.t0 === "clean" ? 12 : 15;
                            break;

                        case 5:
                            _context2.next = 7;
                            return this._photoSyncServices.invalidate(directoryPath);

                        case 7:
                            return _context2.abrupt("break", 16);

                        case 8:
                            _context2.next = 10;
                            return this._photoSyncServices.index(directoryPath, 20);

                        case 10:
                            ctx.body = _context2.sent;
                            return _context2.abrupt("break", 16);

                        case 12:
                            _context2.next = 14;
                            return this._photoSyncServices.clean(directoryPath);

                        case 14:
                            return _context2.abrupt("break", 16);

                        case 15:
                            throw new Error("Unexpected operation: " + requestedOperation);

                        case 16:

                            ctx.status = 200;

                        case 17:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function update(_x2) {
            return _ref2.apply(this, arguments);
        }

        return update;
    }();

    return PhotoSyncResource;
}();