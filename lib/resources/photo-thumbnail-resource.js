"use strict";

exports.__esModule = true;
exports.PhotoThumbnailResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoThumbnailResource = exports.PhotoThumbnailResource = function () {
    function PhotoThumbnailResource(exifTool) {
        _classCallCheck(this, PhotoThumbnailResource);

        this._exifTool = exifTool;
    }

    PhotoThumbnailResource.prototype.get = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var path, buffer;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            path = ctx.params.id;
                            _context.next = 3;
                            return this._exifTool.getThumbnail(path);

                        case 3:
                            buffer = _context.sent;

                            ctx.body = buffer;
                            ctx.response.type = "image/jpeg";

                        case 6:
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

    return PhotoThumbnailResource;
}();