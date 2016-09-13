"use strict";

exports.__esModule = true;
exports.PhotoExifDataResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoExifDataResource = exports.PhotoExifDataResource = function () {
    function PhotoExifDataResource(photoExifDataServices) {
        _classCallCheck(this, PhotoExifDataResource);

        this._photoExifDataServices = photoExifDataServices;
    }

    PhotoExifDataResource.prototype.get = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var id, thumbnailsOnly, includeThumbnails, includeAll;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            id = ctx.params.id;
                            thumbnailsOnly = ctx.query.thumbnailsOnly === "true";
                            includeThumbnails = ctx.query.includeThumbnails === "true";
                            includeAll = !thumbnailsOnly;

                            includeThumbnails = thumbnailsOnly || includeThumbnails;

                            _context.next = 7;
                            return this._photoExifDataServices.getByImageId(id, includeAll, includeThumbnails);

                        case 7:
                            ctx.body = _context.sent;

                        case 8:
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

    PhotoExifDataResource.prototype.query = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var query, includeAll, includeThumbnails;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(!ctx.query || !ctx.query.json)) {
                                _context2.next = 3;
                                break;
                            }

                            ctx.status = 400;
                            return _context2.abrupt("return");

                        case 3:
                            query = JSON.parse(ctx.query.json);
                            includeAll = !query.thumbnailsOnly;
                            includeThumbnails = query.thumbnailsOnly || query.includeThumbnails;

                            if (!query.ids) {
                                _context2.next = 12;
                                break;
                            }

                            _context2.next = 9;
                            return this._photoExifDataServices.getByImageIds(query.ids, includeAll, includeThumbnails);

                        case 9:
                            ctx.body = _context2.sent;
                            _context2.next = 16;
                            break;

                        case 12:
                            if (!query.imageHash) {
                                _context2.next = 16;
                                break;
                            }

                            _context2.next = 15;
                            return this._photoExifDataServices.getByImageHash(query.imageHash, includeAll, includeThumbnails);

                        case 15:
                            ctx.body = _context2.sent;

                        case 16:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function query(_x2) {
            return _ref2.apply(this, arguments);
        }

        return query;
    }();

    PhotoExifDataResource.prototype.updateMany = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var updates, propertyName, type;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            updates = ctx.request.body.updates;
                            propertyName = ctx.request.body.propertyName;
                            type = ctx.request.body.type;
                            _context3.next = 5;
                            return this._photoExifDataServices.updateMany(updates, propertyName, type);

                        case 5:

                            ctx.status = 200;

                        case 6:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function updateMany(_x3) {
            return _ref3.apply(this, arguments);
        }

        return updateMany;
    }();

    return PhotoExifDataResource;
}();