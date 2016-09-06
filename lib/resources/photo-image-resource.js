"use strict";

exports.__esModule = true;
exports.PhotoImageResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoImageResource = exports.PhotoImageResource = function () {
    function PhotoImageResource(photoImageServices) {
        _classCallCheck(this, PhotoImageResource);

        this._photoImageServices = photoImageServices;
    }

    PhotoImageResource.prototype.query = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var query, imageLookup, addImages, images, id;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(!ctx.query || !ctx.query.json)) {
                                _context.next = 3;
                                break;
                            }

                            ctx.status = 400;
                            return _context.abrupt("return");

                        case 3:
                            query = JSON.parse(ctx.query.json);
                            imageLookup = {};

                            addImages = function addImages(images) {
                                for (var _iterator = images, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                                    var _ref2;

                                    if (_isArray) {
                                        if (_i >= _iterator.length) break;
                                        _ref2 = _iterator[_i++];
                                    } else {
                                        _i = _iterator.next();
                                        if (_i.done) break;
                                        _ref2 = _i.value;
                                    }

                                    var image = _ref2;

                                    imageLookup[image.id] = image;
                                }
                            };

                            if (!query.unreadable) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 9;
                            return this._photoImageServices.findUnreadable();

                        case 9:
                            _context.t0 = _context.sent;
                            addImages(_context.t0);

                        case 11:
                            if (!query.missingTakenDate) {
                                _context.next = 16;
                                break;
                            }

                            _context.next = 14;
                            return this._photoImageServices.findMissingTakenDate();

                        case 14:
                            _context.t1 = _context.sent;
                            addImages(_context.t1);

                        case 16:
                            images = [];

                            for (id in imageLookup) {
                                images.push(imageLookup[id]);
                            }

                            ctx.body = images;

                        case 19:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function query(_x) {
            return _ref.apply(this, arguments);
        }

        return query;
    }();

    return PhotoImageResource;
}();