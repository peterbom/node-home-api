"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageDataAccess = exports.ImageDataAccess = function () {
    function ImageDataAccess(dbManager) {
        _classCallCheck(this, ImageDataAccess);

        this._imageInfos = dbManager.get("imageInfos");
    }

    ImageDataAccess.prototype.hasImage = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(inode) {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._imageInfos.findOne({ inode: inode }, { _id: 1 });

                        case 2:
                            result = _context.sent;
                            return _context.abrupt("return", !!result);

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function hasImage(_x) {
            return _ref.apply(this, arguments);
        }

        return hasImage;
    }();

    ImageDataAccess.prototype.findImage = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(inode) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._imageInfos.findOne({ inode: inode });

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function findImage(_x2) {
            return _ref2.apply(this, arguments);
        }

        return findImage;
    }();

    ImageDataAccess.prototype.upsertLocation = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(inode, path, filename) {
            var updates;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            updates = {
                                inode: inode,
                                path: path,
                                filename: filename
                            };
                            _context3.next = 3;
                            return this._imageInfos.findOneAndUpdate({ inode: inode }, { $set: updates }, { upsert: true });

                        case 3:
                            return _context3.abrupt("return", _context3.sent);

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function upsertLocation(_x3, _x4, _x5) {
            return _ref3.apply(this, arguments);
        }

        return upsertLocation;
    }();

    ImageDataAccess.prototype.upsertImage = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(inode, path, filename, imageData, tags) {
            var updates;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            updates = {
                                inode: inode,
                                path: path,
                                filename: filename,
                                imageData: imageData,
                                tags: tags
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

        function upsertImage(_x6, _x7, _x8, _x9, _x10) {
            return _ref4.apply(this, arguments);
        }

        return upsertImage;
    }();

    return ImageDataAccess;
}();