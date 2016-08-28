"use strict";

exports.__esModule = true;
exports.FileFinder = undefined;

var _walk = require("walk");

var _walk2 = _interopRequireDefault(_walk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileFinder = exports.FileFinder = function () {
    function FileFinder() {
        _classCallCheck(this, FileFinder);
    }

    FileFinder.prototype.find = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(basePath, fileMatchRegex, skipDirectoryRegexes) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return new Promise(function (fulfill, reject) {
                                var files = [];
                                var options = {
                                    followLinks: false,
                                    filters: skipDirectoryRegexes
                                };

                                var walker = _walk2.default.walk(basePath, options);
                                walker.on("file", function (root, stat, next) {
                                    if (fileMatchRegex.test(stat.name)) {
                                        files.push({
                                            path: root,
                                            filename: stat.name
                                        });
                                    }

                                    next();
                                });

                                walker.on("errors", function (root, nodeStatsArray, next) {
                                    reject(nodeStatsArray.map(function (stat) {
                                        return stat.error;
                                    }));
                                });

                                walker.on("end", function () {
                                    fulfill(files);
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

        function find(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return find;
    }();

    return FileFinder;
}();