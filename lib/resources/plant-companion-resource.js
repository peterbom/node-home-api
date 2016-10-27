"use strict";

exports.__esModule = true;
exports.PlantCompanionResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantCompanionResource = exports.PlantCompanionResource = function () {
    function PlantCompanionResource(plantCompanionDataAccess) {
        _classCallCheck(this, PlantCompanionResource);

        if (plantCompanionDataAccess === undefined) {
            throw new Error("plantCompanionDataAccess not defined");
        }

        this._plantCompanionDataAccess = plantCompanionDataAccess;
    }

    PlantCompanionResource.prototype.list = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plantCompanionDataAccess.listPlantCompanions();

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

    PlantCompanionResource.prototype.set = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var tsn, helps, hinders;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            tsn = Number.parseInt(ctx.params.tsn);

                            if (!Number.isNaN(tsn)) {
                                _context2.next = 4;
                                break;
                            }

                            ctx.status = 500;
                            return _context2.abrupt("return");

                        case 4:
                            helps = ctx.request.body.helps;
                            hinders = ctx.request.body.hinders;

                            if (!(!helps || !hinders || helps.some(function (tsn) {
                                return Number.isNaN(tsn);
                            }) || hinders.some(function (tsn) {
                                return Number.isNaN(tsn);
                            }))) {
                                _context2.next = 9;
                                break;
                            }

                            ctx.status = 500;
                            return _context2.abrupt("return");

                        case 9:

                            helps = helps.map(function (tsn) {
                                return Number.parseInt(tsn);
                            });
                            hinders = hinders.map(function (tsn) {
                                return Number.parseInt(tsn);
                            });

                            _context2.next = 13;
                            return this._plantCompanionDataAccess.upsertCompanions(tsn, helps, hinders);

                        case 13:

                            ctx.status = 200;

                        case 14:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function set(_x2) {
            return _ref2.apply(this, arguments);
        }

        return set;
    }();

    PlantCompanionResource.prototype.get = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var tsn, companions;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            tsn = Number.parseInt(ctx.params.tsn);

                            if (!Number.isNaN(tsn)) {
                                _context3.next = 4;
                                break;
                            }

                            ctx.status = 500;
                            return _context3.abrupt("return");

                        case 4:
                            _context3.next = 6;
                            return this._plantCompanionDataAccess.findCompanions(tsn);

                        case 6:
                            companions = _context3.sent;

                            if (companions) {
                                _context3.next = 10;
                                break;
                            }

                            ctx.status = 404;
                            return _context3.abrupt("return");

                        case 10:

                            ctx.body = companions;

                        case 11:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function get(_x3) {
            return _ref3.apply(this, arguments);
        }

        return get;
    }();

    PlantCompanionResource.prototype.delete = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
            var tsn;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            tsn = Number.parseInt(ctx.params.tsn);

                            if (!Number.isNaN(tsn)) {
                                _context4.next = 4;
                                break;
                            }

                            ctx.status = 500;
                            return _context4.abrupt("return");

                        case 4:
                            _context4.next = 6;
                            return this._plantCompanionDataAccess.deleteCompanions(tsn);

                        case 6:

                            ctx.status = 200;

                        case 7:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function _delete(_x4) {
            return _ref4.apply(this, arguments);
        }

        return _delete;
    }();

    return PlantCompanionResource;
}();