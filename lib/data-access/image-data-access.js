"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageDataAccess = exports.ImageDataAccess = function () {
    function ImageDataAccess(dbManager) {
        _classCallCheck(this, ImageDataAccess);

        this._imageInfos = dbManager.get("imageInfos");
    }

    ImageDataAccess.prototype.hasUnknownFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path, filenames) {
            var matches, knownFilenames;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            path = path.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });
                            _context.next = 4;
                            return this._imageInfos.find({ path: path, filename: { $in: filenames } }, { filename: 1 });

                        case 4:
                            matches = _context.sent;
                            knownFilenames = matches.map(function (m) {
                                return m.filename;
                            });
                            return _context.abrupt("return", filenames.some(function (f) {
                                return knownFilenames.indexOf(f) < 0;
                            }));

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function hasUnknownFiles(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return hasUnknownFiles;
    }();

    ImageDataAccess.prototype.hasImage = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(inode) {
            var result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._imageInfos.findOne({ inode: inode }, { _id: 1 });

                        case 2:
                            result = _context2.sent;
                            return _context2.abrupt("return", !!result);

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function hasImage(_x3) {
            return _ref2.apply(this, arguments);
        }

        return hasImage;
    }();

    ImageDataAccess.prototype.findImage = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(inode) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._imageInfos.findOne({ inode: inode });

                        case 2:
                            return _context3.abrupt("return", _context3.sent);

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function findImage(_x4) {
            return _ref3.apply(this, arguments);
        }

        return findImage;
    }();

    ImageDataAccess.prototype.upsertLocation = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(inode, path, filename) {
            var updates;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            updates = {
                                inode: inode,
                                path: path.toLowerCase(),
                                filename: filename.toLowerCase()
                            };
                            _context4.next = 3;
                            return this._imageInfos.findOneAndUpdate({ inode: inode }, { $set: updates }, { upsert: true });

                        case 3:
                            return _context4.abrupt("return", _context4.sent);

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function upsertLocation(_x5, _x6, _x7) {
            return _ref4.apply(this, arguments);
        }

        return upsertLocation;
    }();

    ImageDataAccess.prototype.upsertImage = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(inode, path, filename, imageData, tags) {
            var updates;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            updates = {
                                inode: inode,
                                path: path.toLowerCase(),
                                filename: filename.toLowerCase(),
                                imageData: imageData,
                                tags: tags
                            };
                            _context5.next = 3;
                            return this._imageInfos.findOneAndUpdate({ inode: inode }, { $set: updates }, { upsert: true });

                        case 3:
                            return _context5.abrupt("return", _context5.sent);

                        case 4:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function upsertImage(_x8, _x9, _x10, _x11, _x12) {
            return _ref5.apply(this, arguments);
        }

        return upsertImage;
    }();

    return ImageDataAccess;
}();