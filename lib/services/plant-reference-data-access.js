"use strict";

exports.__esModule = true;
exports.PlantReferenceDataAccess = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantReferenceDataAccess = exports.PlantReferenceDataAccess = function () {
    // dbManager: https://automattic.github.io/monk/docs/manager/index.html
    function PlantReferenceDataAccess(dbManager) {
        _classCallCheck(this, PlantReferenceDataAccess);

        this._plantReferences = dbManager.get("plantReferences");
        this._plantReferences.ensureIndex({ "type": 1, "key": 1 });
    }

    PlantReferenceDataAccess.prototype.findReferences = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, key) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plantReferences.find({ type: type, key: key });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function findReferences(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return findReferences;
    }();

    PlantReferenceDataAccess.prototype.insertReference = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(type, key, reference) {
            var references, list;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (type) {
                                _context2.next = 2;
                                break;
                            }

                            throw new Error("type is not set");

                        case 2:
                            if (key) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error("key is not set");

                        case 4:
                            if (!(!reference.url && !reference.paper)) {
                                _context2.next = 6;
                                break;
                            }

                            throw new Error("Neither URL nor paper specified for reference");

                        case 6:
                            _context2.next = 8;
                            return this.findReferences(type, key);

                        case 8:
                            references = _context2.sent;
                            list = references ? references.list : [];


                            reference = {
                                type: type,
                                key: key,
                                url: reference.url,
                                paper: reference.paper,
                                extract: reference.extract
                            };

                            _context2.next = 13;
                            return this._plantReferences.insert(reference);

                        case 13:
                            return _context2.abrupt("return", _context2.sent);

                        case 14:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function insertReference(_x3, _x4, _x5) {
            return _ref2.apply(this, arguments);
        }

        return insertReference;
    }();

    PlantReferenceDataAccess.prototype.deleteReference = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._plantReferences.findOneAndDelete({ _id: id });

                        case 2:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function deleteReference(_x6) {
            return _ref3.apply(this, arguments);
        }

        return deleteReference;
    }();

    PlantReferenceDataAccess.prototype.listReferences = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(type) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this._plantReferences.find({ type: type });

                        case 2:
                            return _context4.abrupt("return", _context4.sent);

                        case 3:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function listReferences(_x7) {
            return _ref4.apply(this, arguments);
        }

        return listReferences;
    }();

    return PlantReferenceDataAccess;
}();