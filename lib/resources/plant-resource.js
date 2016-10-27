"use strict";

exports.__esModule = true;
exports.PlantResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantResource = exports.PlantResource = function () {
    function PlantResource(plantDataAccess) {
        _classCallCheck(this, PlantResource);

        if (plantDataAccess === undefined) {
            throw new Error("plantDataAccess not defined");
        }

        this._plantDataAccess = plantDataAccess;
    }

    PlantResource.prototype.listPlants = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plantDataAccess.listPlants();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function listPlants(_x) {
            return _ref.apply(this, arguments);
        }

        return listPlants;
    }();

    PlantResource.prototype.listLinks = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._plantDataAccess.listLinks();

                        case 2:
                            ctx.body = _context2.sent;

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function listLinks(_x2) {
            return _ref2.apply(this, arguments);
        }

        return listLinks;
    }();

    PlantResource.prototype.set = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var tsn, plant;
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
                            plant = ctx.request.body;
                            _context3.next = 7;
                            return this._plantDataAccess.upsertPlant(tsn, plant);

                        case 7:
                            ctx.status = 200;

                        case 8:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function set(_x3) {
            return _ref3.apply(this, arguments);
        }

        return set;
    }();

    PlantResource.prototype.get = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
            var plant;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._plantDataAccess.findPlant(Number.parseInt(ctx.params.tsn));

                        case 2:
                            plant = _context4.sent;

                            if (plant) {
                                _context4.next = 6;
                                break;
                            }

                            ctx.status = 404;
                            return _context4.abrupt("return");

                        case 6:

                            ctx.body = plant;

                        case 7:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function get(_x4) {
            return _ref4.apply(this, arguments);
        }

        return get;
    }();

    return PlantResource;
}();