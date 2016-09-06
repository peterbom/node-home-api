"use strict";

exports.__esModule = true;
exports.PhotoDuplicateResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDuplicateResource = exports.PhotoDuplicateResource = function () {
    function PhotoDuplicateResource(photoDuplicateServices) {
        _classCallCheck(this, PhotoDuplicateResource);

        this._photoDuplicateServices = photoDuplicateServices;
    }

    PhotoDuplicateResource.prototype.get = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var hash;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            hash = ctx.params.id;
                            _context.next = 3;
                            return this._photoDuplicateServices.getDuplicates(hash);

                        case 3:
                            ctx.body = _context.sent;

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function get(_x) {
            return _ref.apply(this, arguments);
        }

        return get;
    }();

    PhotoDuplicateResource.prototype.list = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoDuplicateServices.listDuplicates();

                        case 2:
                            ctx.body = _context2.sent;

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function list(_x2) {
            return _ref2.apply(this, arguments);
        }

        return list;
    }();

    PhotoDuplicateResource.prototype.resolve = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var hash, sameIds, differentIds;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            hash = ctx.params.id;

                            // Expect the body to contain:
                            // sameIds: [<_id1>, ...]
                            // differentIds: [<_id1>, ...]

                            sameIds = ctx.request.body.sameIds;
                            differentIds = ctx.request.body.differentIds;
                            _context3.next = 5;
                            return this._photoDuplicateServices.resolveDuplicates(sameIds, differentIds);

                        case 5:

                            ctx.status = 200;

                        case 6:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function resolve(_x3) {
            return _ref3.apply(this, arguments);
        }

        return resolve;
    }();

    return PhotoDuplicateResource;
}();