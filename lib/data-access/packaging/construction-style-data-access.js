"use strict";

exports.__esModule = true;
exports.ConstructionStyleDataAccess = undefined;

var _odbcDatabase = require("../odbc-database");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var listSql = "\nselect      ConstructionStyleId as id\n            , FefcoEsboCode as fefcoEsboCode\n            , Name as name\nfrom        ConstructionStyles\n";

var detailSql = "\nselect      cs.ConstructionStyleId as id\n            , cs.FefcoEsboCode as fefcoEsboCode\n            , cs.Name as name\n            , f.FormulaText as formulaText\n            , cs.UpdateVersion as updateVersion\nfrom        ConstructionStyles as cs\ninner join  Formulas as f on f.FormulaId = cs.PieceLengthFormulaId\nwhere       cs.ConstructionStyleId = ?\n";

var detailVariablesSql = "\nselect      fv.VariableIndex as variableIndex\n            , fv.VariableIdentifier as variableName\n            , coalesce(fv.PropertyName, ep.PropertyName) as propertyName\n            , ep.EntityCode as entityCode\nfrom        ConstructionStyles as cs\ninner join  FormulaVariables as fv on fv.FormulaVariableSetId = cs.FormulaVariableSetId\nleft join   ExtraProperties as ep on ep.ExtraPropertyId = fv.ExtraPropertyId\nwhere       cs.ConstructionStyleId = ?\n";

var ConstructionStyleDataAccess = exports.ConstructionStyleDataAccess = function () {
    function ConstructionStyleDataAccess(databaseFactory) {
        _classCallCheck(this, ConstructionStyleDataAccess);

        if (databaseFactory === undefined) {
            throw new Error("databaseFactory not defined");
        }

        this._getDb = function () {
            return databaseFactory && databaseFactory() || new _odbcDatabase.Database();
        };
    }

    ConstructionStyleDataAccess.prototype.getAll = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._getDb().withOpenConnection(function (db) {
                                return db.query(listSql);
                            });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getAll() {
            return _ref.apply(this, arguments);
        }

        return getAll;
    }();

    ConstructionStyleDataAccess.prototype.getDetail = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
            var _ref3, details, variables, detail;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._getDb().withOpenConnection(function (db) {
                                return Promise.all([db.query(detailSql, [id]), db.query(detailVariablesSql, [id])]);
                            });

                        case 2:
                            _ref3 = _context2.sent;
                            details = _ref3[0];
                            variables = _ref3[1];
                            detail = details[0];

                            detail.variables = variables;
                            return _context2.abrupt("return", detail);

                        case 8:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getDetail(_x) {
            return _ref2.apply(this, arguments);
        }

        return getDetail;
    }();

    return ConstructionStyleDataAccess;
}();