"use strict";

exports.__esModule = true;
exports.PhotoDuplicateResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDuplicateResource = exports.PhotoDuplicateResource = function () {
    function PhotoDuplicateResource(photoDirectoryDataAccess) {
        _classCallCheck(this, PhotoDuplicateResource);

        this._photoDirectoryDataAccess = photoDirectoryDataAccess;
    }

    PhotoDuplicateResource.prototype.list = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoDirectoryDataAccess.getDuplicates();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function list(_x) {
            return _ref.apply(this, arguments);
        }

        return list;
    }();

    PhotoDuplicateResource.prototype.resolve = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var hash, sameIds, differentIds;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            hash = ctx.params.id;

                            // Expect the body to contain:
                            // sameIds: [<_id1>, ...]
                            // differentIds: [<_id1>, ...]

                            sameIds = ctx.request.body.sameIds;
                            differentIds = ctx.request.body.differentIds;
                            _context2.next = 5;
                            return this._photoDirectoryDataAccess.resolveDuplicates(sameIds, differentIds);

                        case 5:

                            ctx.status = 200;

                        case 6:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function resolve(_x2) {
            return _ref2.apply(this, arguments);
        }

        return resolve;
    }();

    return PhotoDuplicateResource;
}();