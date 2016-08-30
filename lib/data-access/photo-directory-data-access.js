"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDirectoryDataAccess = exports.PhotoDirectoryDataAccess = function () {
    function PhotoDirectoryDataAccess(fileFinder, photoBaseDirectories) {
        _classCallCheck(this, PhotoDirectoryDataAccess);

        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    PhotoDirectoryDataAccess.prototype.getAll = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._fileFinder.findFiles(this._photoBaseDirectories, [/(?!.*\/)?@.*/, /.*\.db/], /^(?!.*\.db$)/);

                        case 2:
                            _context.next = 4;
                            return this._fileFinder.findDirectories(this._photoBaseDirectories, [/(?!.*\/)?@.*$/, /.*\.db/]);

                        case 4:
                            return _context.abrupt("return", _context.sent);

                        case 5:
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

    PhotoDirectoryDataAccess.prototype.getNew = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(directory) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getNew(_x) {
            return _ref2.apply(this, arguments);
        }

        return getNew;
    }();

    return PhotoDirectoryDataAccess;
}();