"use strict";

exports.__esModule = true;
exports.FileServices = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mv = (0, _promisifyNode2.default)("mv");
var fs = (0, _promisifyNode2.default)("fs");

var FileServices = exports.FileServices = function () {
    function FileServices() {
        _classCallCheck(this, FileServices);
    }

    FileServices.prototype.findDirectories = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(baseDirectories) {
            var _this = this;

            for (var _len = arguments.length, skipDirectoryRegexes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                skipDirectoryRegexes[_key - 1] = arguments[_key];
            }

            var findDirectories, promises, resultArrays, results;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            findDirectories = function () {
                                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(baseDirectory) {
                                    var list, dircheck, walkdir;
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    list = [];

                                                    dircheck = function () {
                                                        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(fd) {
                                                            var stats;
                                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                while (1) {
                                                                    switch (_context.prev = _context.next) {
                                                                        case 0:
                                                                            _context.next = 2;
                                                                            return fs.stat(fd);

                                                                        case 2:
                                                                            stats = _context.sent;

                                                                            if (!(stats.isDirectory() && !skipDirectoryRegexes.some(function (skipRegex) {
                                                                                return skipRegex.test(fd);
                                                                            }))) {
                                                                                _context.next = 7;
                                                                                break;
                                                                            }

                                                                            list.push(fd);
                                                                            _context.next = 7;
                                                                            return walkdir(fd);

                                                                        case 7:
                                                                        case "end":
                                                                            return _context.stop();
                                                                    }
                                                                }
                                                            }, _callee, _this);
                                                        }));

                                                        return function dircheck(_x4) {
                                                            return _ref3.apply(this, arguments);
                                                        };
                                                    }();

                                                    walkdir = function () {
                                                        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dir) {
                                                            var files, promises;
                                                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                                while (1) {
                                                                    switch (_context2.prev = _context2.next) {
                                                                        case 0:
                                                                            _context2.next = 2;
                                                                            return fs.readdir(dir);

                                                                        case 2:
                                                                            files = _context2.sent;
                                                                            promises = files.map(function (file) {
                                                                                return dircheck(_path2.default.join(dir, file));
                                                                            });
                                                                            _context2.next = 6;
                                                                            return Promise.all(promises);

                                                                        case 6:
                                                                        case "end":
                                                                            return _context2.stop();
                                                                    }
                                                                }
                                                            }, _callee2, _this);
                                                        }));

                                                        return function walkdir(_x5) {
                                                            return _ref4.apply(this, arguments);
                                                        };
                                                    }();

                                                    _context3.next = 5;
                                                    return dircheck(baseDirectory);

                                                case 5:
                                                    return _context3.abrupt("return", list);

                                                case 6:
                                                case "end":
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                }));

                                return function findDirectories(_x3) {
                                    return _ref2.apply(this, arguments);
                                };
                            }();

                            promises = baseDirectories.map(findDirectories);
                            _context4.next = 4;
                            return Promise.all(promises);

                        case 4:
                            resultArrays = _context4.sent;
                            results = resultArrays.reduce(function (a, b) {
                                return a.concat(b);
                            }, []);
                            return _context4.abrupt("return", results);

                        case 7:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function findDirectories(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return findDirectories;
    }();

    FileServices.prototype.getFiles = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(directoryPath, fileMatchRegex) {
            var _this2 = this;

            var directoryStats, items, filenames, isFile;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            _context6.next = 3;
                            return fs.stat(directoryPath);

                        case 3:
                            directoryStats = _context6.sent;

                            if (directoryStats.isDirectory()) {
                                _context6.next = 6;
                                break;
                            }

                            return _context6.abrupt("return", []);

                        case 6:
                            _context6.next = 11;
                            break;

                        case 8:
                            _context6.prev = 8;
                            _context6.t0 = _context6["catch"](0);
                            return _context6.abrupt("return", []);

                        case 11:
                            _context6.next = 13;
                            return fs.readdir(directoryPath);

                        case 13:
                            items = _context6.sent;

                            items = items.filter(function (item) {
                                return fileMatchRegex.test(item);
                            });

                            filenames = [];

                            isFile = function () {
                                var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(item) {
                                    var itemPath, stats;
                                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                        while (1) {
                                            switch (_context5.prev = _context5.next) {
                                                case 0:
                                                    itemPath = _path2.default.join(directoryPath, item);
                                                    _context5.next = 3;
                                                    return fs.stat(itemPath);

                                                case 3:
                                                    stats = _context5.sent;

                                                    if (stats.isFile()) {
                                                        filenames.push(item);
                                                    }

                                                case 5:
                                                case "end":
                                                    return _context5.stop();
                                            }
                                        }
                                    }, _callee5, _this2);
                                }));

                                return function isFile(_x8) {
                                    return _ref6.apply(this, arguments);
                                };
                            }();

                            _context6.next = 19;
                            return Promise.all(items.map(isFile));

                        case 19:
                            return _context6.abrupt("return", filenames);

                        case 20:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this, [[0, 8]]);
        }));

        function getFiles(_x6, _x7) {
            return _ref5.apply(this, arguments);
        }

        return getFiles;
    }();

    FileServices.prototype.exists = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(filePath) {
            var stats;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;
                            _context7.next = 3;
                            return fs.stat(filePath);

                        case 3:
                            stats = _context7.sent;
                            return _context7.abrupt("return", stats && stats.isFile());

                        case 7:
                            _context7.prev = 7;
                            _context7.t0 = _context7["catch"](0);
                            return _context7.abrupt("return", false);

                        case 10:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this, [[0, 7]]);
        }));

        function exists(_x9) {
            return _ref7.apply(this, arguments);
        }

        return exists;
    }();

    FileServices.prototype.delete = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(filePath) {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return fs.unlink(filePath);

                        case 2:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function _delete(_x10) {
            return _ref8.apply(this, arguments);
        }

        return _delete;
    }();

    FileServices.prototype.move = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(fromFilePath, toFilePath) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.next = 2;
                            return mv(fromFilePath, toFilePath, { mkdirp: true, clobber: false });

                        case 2:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function move(_x11, _x12) {
            return _ref9.apply(this, arguments);
        }

        return move;
    }();

    return FileServices;
}();