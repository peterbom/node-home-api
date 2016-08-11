"use strict";

exports.__esModule = true;
exports.getAll = undefined;

var getAll = exports.getAll = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return getDb().open(_globals.appSettings.packagingConnectionString);

                    case 2:
                        _context.prev = 2;
                        _context.next = 5;
                        return getDb().query("select * from ConstructionStyles");

                    case 5:
                        return _context.abrupt("return", _context.sent);

                    case 6:
                        _context.prev = 6;
                        _context.next = 9;
                        return getDb().close();

                    case 9:
                        return _context.finish(6);

                    case 10:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[2,, 6, 10]]);
    }));

    return function getAll() {
        return _ref.apply(this, arguments);
    };
}();

var _globals = require("../../globals");

var _odbcPromise = require("../odbc-promise");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var _db = void 0;

function getDb() {
    if (!_db) {
        _db = _globals.appSettings.databaseFactory && _globals.appSettings.databaseFactory() || new _odbcPromise.Database();
    }

    return _db;
}