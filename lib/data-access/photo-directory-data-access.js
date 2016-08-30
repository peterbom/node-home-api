"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoDirectoryDataAccess = exports.PhotoDirectoryDataAccess = function () {
    function PhotoDirectoryDataAccess(imageDataAccess, fileFinder, photoBaseDirectories) {
        _classCallCheck(this, PhotoDirectoryDataAccess);

        this._imageDataAccess = imageDataAccess;
        this._fileFinder = fileFinder;
        this._photoBaseDirectories = photoBaseDirectories;
    }

    PhotoDirectoryDataAccess.prototype.getAll = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var files, directories, directoryLookup, unknownCheckPromises, _loop, _iterator, _isArray, _i, _ref2, _ret;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._fileFinder.findFiles(this._photoBaseDirectories, [/(?!.*\/)?@.*/, /.*\.db/], /^(?!.*\.db$)/);

                        case 2:
                            files = _context2.sent;
                            directories = [];
                            directoryLookup = {};

                            files.forEach(function (file) {
                                var directory = directoryLookup[file.path];

                                if (!directory) {
                                    directory = {
                                        path: file.path,
                                        files: [],
                                        hasUnknownFiles: null
                                    };

                                    directories.push(directory);
                                    directoryLookup[file.path] = directory;
                                }

                                directory.files.push(file.filename);
                            });

                            unknownCheckPromises = [];

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref2 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref2 = _i.value;
                                }

                                var directory = _ref2;

                                var unknownCheck = function () {
                                    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this._imageDataAccess.hasUnknownFiles(directory.path, directory.files);

                                                    case 2:
                                                        directory.hasUnknownFiles = _context.sent;

                                                    case 3:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function unknownCheck() {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();

                                unknownCheckPromises.push(unknownCheck());
                            };

                            _iterator = directories, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 9:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context2.next = 12;
                                break;
                            }

                            return _context2.abrupt("break", 14);

                        case 12:
                            _context2.next = 9;
                            break;

                        case 14:
                            _context2.next = 16;
                            return Promise.all(unknownCheckPromises);

                        case 16:
                            return _context2.abrupt("return", directories);

                        case 17:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getAll() {
            return _ref.apply(this, arguments);
        }

        return getAll;
    }();

    PhotoDirectoryDataAccess.prototype.getNew = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(directory) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getNew(_x) {
            return _ref4.apply(this, arguments);
        }

        return getNew;
    }();

    return PhotoDirectoryDataAccess;
}();