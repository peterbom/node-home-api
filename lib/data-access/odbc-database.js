"use strict";

exports.__esModule = true;
exports.OdbcDatabase = undefined;

var _odbc = require("odbc");

var _odbc2 = _interopRequireDefault(_odbc);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OdbcDatabase = exports.OdbcDatabase = function () {
    function OdbcDatabase(connectionString) {
        _classCallCheck(this, OdbcDatabase);

        if (connectionString === undefined) {
            throw new Error("connectionString not defined");
        }

        this._database = new _odbc2.default.Database();
        this._connectionString = connectionString;
    }

    OdbcDatabase.prototype.open = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var _this = this;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return new Promise(function (resolve, reject) {
                                _this._database.open(_this._connectionString, function (err, result) {
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

        function open() {
            return _ref.apply(this, arguments);
        }

        return open;
    }();

    OdbcDatabase.prototype.close = function () {
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

    OdbcDatabase.prototype.query = function () {
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
                                        console.log("-- Error running query:\n" + sql + "\n" + err);
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

        function query(_x, _x2) {
            return _ref3.apply(this, arguments);
        }

        return query;
    }();

    OdbcDatabase.prototype.withOpenConnection = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var action = arguments.length <= 0 || arguments[0] === undefined ? function (db) {} : arguments[0];
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this.open();

                        case 2:
                            _context4.prev = 2;
                            _context4.next = 5;
                            return action(this);

                        case 5:
                            return _context4.abrupt("return", _context4.sent);

                        case 6:
                            _context4.prev = 6;
                            _context4.next = 9;
                            return this.close();

                        case 9:
                            return _context4.finish(6);

                        case 10:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[2,, 6, 10]]);
        }));

        function withOpenConnection(_x3) {
            return _ref4.apply(this, arguments);
        }

        return withOpenConnection;
    }();

    return OdbcDatabase;
}();