"use strict";

exports.__esModule = true;
exports.PlantCompanionDataAccess = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantCompanionDataAccess = exports.PlantCompanionDataAccess = function () {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    function PlantCompanionDataAccess(dbManager) {
        _classCallCheck(this, PlantCompanionDataAccess);

        this._plantCompanions = dbManager.get("plantCompanions");
    }

    PlantCompanionDataAccess.prototype.findCompanions = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(tsn) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plantCompanions.findOne({ _id: tsn });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findCompanions(_x) {
            return _ref.apply(this, arguments);
        }

        return findCompanions;
    }();

    PlantCompanionDataAccess.prototype.upsertCompanions = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(tsn, helps, hinders) {
            var plantCompanions;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (tsn) {
                                _context2.next = 2;
                                break;
                            }

                            throw new Error("tsn is not set");

                        case 2:
                            if (helps) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error("helps is not set");

                        case 4:
                            if (hinders) {
                                _context2.next = 6;
                                break;
                            }

                            throw new Error("hinders is not set");

                        case 6:

                            helps.forEach(function (tsn) {
                                if (Number.isNaN(tsn)) {
                                    throw new Error("helps tsn is not a number");
                                }
                            });

                            hinders.forEach(function (tsn) {
                                if (Number.isNaN(tsn)) {
                                    throw new Error("hinders tsn is not a number");
                                }
                            });

                            plantCompanions = {
                                _id: tsn,
                                helps: helps.map(function (tsn) {
                                    return tsn;
                                }),
                                hinders: hinders.map(function (tsn) {
                                    return tsn;
                                })
                            };
                            _context2.next = 11;
                            return this._plantCompanions.findOneAndUpdate({ _id: tsn }, plantCompanions, { upsert: true });

                        case 11:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function upsertCompanions(_x2, _x3, _x4) {
            return _ref2.apply(this, arguments);
        }

        return upsertCompanions;
    }();

    PlantCompanionDataAccess.prototype.listPlantCompanions = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._plantCompanions.find();

                        case 2:
                            return _context3.abrupt("return", _context3.sent);

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function listPlantCompanions() {
            return _ref3.apply(this, arguments);
        }

        return listPlantCompanions;
    }();

    PlantCompanionDataAccess.prototype.deleteCompanions = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(tsn) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._plantCompanions.remove({ _id: tsn });

                        case 2:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function deleteCompanions(_x5) {
            return _ref4.apply(this, arguments);
        }

        return deleteCompanions;
    }();

    return PlantCompanionDataAccess;
}();