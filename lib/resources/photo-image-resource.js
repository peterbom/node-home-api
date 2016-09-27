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

    PhotoImageResource.prototype.getById = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var id, image;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            id = ctx.params.id;
                            _context.next = 3;
                            return this._photoImageServices.getById(id);

                        case 3:
                            image = _context.sent;

                            if (image) {
                                _context.next = 7;
                                break;
                            }

                            ctx.status = 404;
                            return _context.abrupt("return");

                        case 7:

                            ctx.body = image;
                            ctx.status = 200;

                        case 9:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getById(_x) {
            return _ref.apply(this, arguments);
        }

        return getById;
    }();

    PhotoImageResource.prototype.query = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var query, imageLookup, addImages, images, id;
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

                            /*
                            json: {
                                preset: [string],  // "unreadable", "missingTakenDate"
                                summary: {
                                    counts: [bool],
                                    yearlyTotals: [bool]
                                },
                                criteria: {
                                    path: [string],
                                    fromDateTime: [Date],
                                    toDateTime: [Date]
                                },
                                return: {
                                    id: [bool],
                                    takenDateTime: [bool],
                                    tags: [bool],
                                    hash: [bool],
                                    path: [bool]
                                }  // if unspecified, return all
                            }
                            */
                            query = JSON.parse(ctx.query.json);

                            if (!query.summary) {
                                _context2.next = 22;
                                break;
                            }

                            ctx.body = {};

                            if (!query.summary.counts) {
                                _context2.next = 13;
                                break;
                            }

                            _context2.t0 = Object;
                            _context2.t1 = ctx.body;
                            _context2.next = 11;
                            return this._photoImageServices.getSummaryCounts();

                        case 11:
                            _context2.t2 = _context2.sent;

                            _context2.t0.assign.call(_context2.t0, _context2.t1, _context2.t2);

                        case 13:
                            if (!query.summary.yearlyTotals) {
                                _context2.next = 21;
                                break;
                            }

                            _context2.t3 = Object;
                            _context2.t4 = ctx.body;
                            _context2.next = 18;
                            return this._photoImageServices.getYearlyTotals();

                        case 18:
                            _context2.t5 = _context2.sent;
                            _context2.t6 = {
                                yearlyTotals: _context2.t5
                            };

                            _context2.t3.assign.call(_context2.t3, _context2.t4, _context2.t6);

                        case 21:
                            return _context2.abrupt("return");

                        case 22:

                            // Add images to a map keyed on 'id' to revent duplicates
                            imageLookup = {};

                            addImages = function addImages(images) {
                                for (var _iterator = images, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                                    var _ref3;

                                    if (_isArray) {
                                        if (_i >= _iterator.length) break;
                                        _ref3 = _iterator[_i++];
                                    } else {
                                        _i = _iterator.next();
                                        if (_i.done) break;
                                        _ref3 = _i.value;
                                    }

                                    var image = _ref3;

                                    var returnImage = image;
                                    if (query.return) {
                                        returnImage = {};
                                        for (var propertyName in query.return) {
                                            returnImage[propertyName] = propertyName.split('.').reduce(function (a, b) {
                                                return a[b];
                                            }, image);
                                        }
                                    }

                                    imageLookup[image.id] = returnImage;
                                }
                            };

                            if (!query.preset) {
                                _context2.next = 41;
                                break;
                            }

                            _context2.t7 = query.preset;
                            _context2.next = _context2.t7 === "unreadable" ? 28 : _context2.t7 === "missingTakenDate" ? 33 : 38;
                            break;

                        case 28:
                            _context2.next = 30;
                            return this._photoImageServices.findUnreadable();

                        case 30:
                            _context2.t8 = _context2.sent;
                            addImages(_context2.t8);
                            return _context2.abrupt("break", 39);

                        case 33:
                            _context2.next = 35;
                            return this._photoImageServices.findMissingTakenDate();

                        case 35:
                            _context2.t9 = _context2.sent;
                            addImages(_context2.t9);
                            return _context2.abrupt("break", 39);

                        case 38:
                            throw new Error("Unexpected preset: " + query.preset);

                        case 39:
                            _context2.next = 46;
                            break;

                        case 41:
                            if (!query.criteria) {
                                _context2.next = 46;
                                break;
                            }

                            _context2.next = 44;
                            return this._photoImageServices.findByCriteria(query.criteria);

                        case 44:
                            _context2.t10 = _context2.sent;
                            addImages(_context2.t10);

                        case 46:

                            // Construct array to return
                            images = [];

                            for (id in imageLookup) {
                                images.push(imageLookup[id]);
                            }

                            // Sort by taken date, then by id
                            images.sort(function (a, b) {
                                if (a.takenDateTime && b.takenDateTime) {
                                    return a.takenDateTime - b.takenDateTime;
                                }

                                if (a.takenDateTime) {
                                    return 1;
                                }

                                if (b.takenDateTime) {
                                    return -1;
                                }

                                // Two ids will never be the same
                                return a.id < b.id ? -1 : 1;
                            });

                            ctx.body = images;

                        case 50:
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

    return PhotoImageResource;
}();