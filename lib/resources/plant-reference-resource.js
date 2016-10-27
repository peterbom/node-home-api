"use strict";

exports.__esModule = true;
exports.PlantReferenceResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlantReferenceResource = exports.PlantReferenceResource = function () {
    function PlantReferenceResource(plantReferenceDataAccess) {
        _classCallCheck(this, PlantReferenceResource);

        if (plantReferenceDataAccess === undefined) {
            throw new Error("plantReferenceDataAccess not defined");
        }

        this._plantReferenceDataAccess = plantReferenceDataAccess;
    }

    PlantReferenceResource.prototype.listCompanionHelp = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._plantReferenceDataAccess.listReferences("companion-help");

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function listCompanionHelp(_x) {
            return _ref.apply(this, arguments);
        }

        return listCompanionHelp;
    }();

    PlantReferenceResource.prototype.listCompanionHinder = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._plantReferenceDataAccess.listReferences("companion-hinder");

                        case 2:
                            ctx.body = _context2.sent;

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function listCompanionHinder(_x2) {
            return _ref2.apply(this, arguments);
        }

        return listCompanionHinder;
    }();

    PlantReferenceResource.prototype.addCompanionHelpReference = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
            var tsn1, tsn2;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            tsn1 = Number.parseInt(ctx.params.tsn1);
                            tsn2 = Number.parseInt(ctx.params.tsn2);
                            _context3.next = 4;
                            return this._plantReferenceDataAccess.insertReference("companion-help", tsn1 + "-" + tsn2, ctx.request.body);

                        case 4:

                            ctx.status = 200;

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function addCompanionHelpReference(_x3) {
            return _ref3.apply(this, arguments);
        }

        return addCompanionHelpReference;
    }();

    PlantReferenceResource.prototype.addCompanionHinderReference = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
            var tsn1, tsn2;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            tsn1 = Number.parseInt(ctx.params.tsn1);
                            tsn2 = Number.parseInt(ctx.params.tsn2);
                            _context4.next = 4;
                            return this._plantReferenceDataAccess.insertReference("companion-hinder", tsn1 + "-" + tsn2, ctx.request.body);

                        case 4:

                            ctx.status = 200;

                        case 5:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function addCompanionHinderReference(_x4) {
            return _ref4.apply(this, arguments);
        }

        return addCompanionHinderReference;
    }();

    PlantReferenceResource.prototype.deleteReference = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
            var id;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            id = ctx.params.id;
                            _context5.next = 3;
                            return this._plantReferenceDataAccess.deleteReference(id);

                        case 3:

                            ctx.status = 200;

                        case 4:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function deleteReference(_x5) {
            return _ref5.apply(this, arguments);
        }

        return deleteReference;
    }();

    return PlantReferenceResource;
}();