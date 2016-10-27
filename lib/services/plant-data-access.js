"use strict";

exports.__esModule = true;
exports.PlantDataAccess = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantDataAccess = exports.PlantDataAccess = function () {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    function PlantDataAccess(dbManager) {
        _classCallCheck(this, PlantDataAccess);

        this._plants = dbManager.get("plants");
        this._plants.ensureIndex({ "scientificName": 1 });

        this._plantHierarchy = dbManager.get("plantHierarchy");
    }

    PlantDataAccess.prototype.findPlant = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(tsn) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plants.findOne({ _id: tsn });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findPlant(_x) {
            return _ref.apply(this, arguments);
        }

        return findPlant;
    }();

    PlantDataAccess.prototype.upsertPlant = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(tsn, properties) {
            var plant;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (properties.scientificName) {
                                _context2.next = 2;
                                break;
                            }

                            throw new Error("scientificName is not set");

                        case 2:
                            if (properties.rankName) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error("rankName is not set");

                        case 4:

                            //let tsn = properties.path[properties.path.length - 1];

                            plant = {
                                _id: tsn,
                                scientificName: properties.scientificName,
                                commonName: properties.commonName,
                                rankName: properties.rankName,
                                use: properties.use
                            };
                            _context2.next = 7;
                            return this._plants.findOneAndUpdate({ _id: tsn }, plant, { upsert: true });

                        case 7:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function upsertPlant(_x2, _x3) {
            return _ref2.apply(this, arguments);
        }

        return upsertPlant;
    }();

    PlantDataAccess.prototype.listPlants = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._plants.find();

                        case 2:
                            return _context3.abrupt("return", _context3.sent);

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function listPlants() {
            return _ref3.apply(this, arguments);
        }

        return listPlants;
    }();

    PlantDataAccess.prototype.listLinks = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._plantHierarchy.find({}, { fields: { parentId: 1 } });

                        case 2:
                            return _context4.abrupt("return", _context4.sent);

                        case 3:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function listLinks() {
            return _ref4.apply(this, arguments);
        }

        return listLinks;
    }();

    return PlantDataAccess;
}();