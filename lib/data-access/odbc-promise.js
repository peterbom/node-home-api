"use strict";

exports.__esModule = true;
exports.Database = undefined;

var _odbc = require("odbc");

var _odbc2 = _interopRequireDefault(_odbc);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = exports.Database = function () {
    function Database(options) {
        _classCallCheck(this, Database);

        this._database = new _odbc2.default.Database(options);
    }

    Database.prototype.open = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(connectionString) {
            var _this = this;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return new Promise(function (resolve, reject) {
                                _this._database.open(connectionString, function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
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

        function open(_x) {
            return _ref.apply(this, arguments);
        }

        return open;
    }();

    Database.prototype.close = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this2 = this;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return new Promise(function (resolve, reject) {
                                _this2._database.close(function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });

                        case 2:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function close() {
            return _ref2.apply(this, arguments);
        }

        return close;
    }();

    Database.prototype.query = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(sql, params) {
            var _this3 = this;

            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return new Promise(function (resolve, reject) {
                                _this3._database.query(sql, params, function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });

                        case 2:
                            return _context3.abrupt("return", _context3.sent);

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function query(_x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return query;
    }();

    return Database;
}();