"use strict";

exports.__esModule = true;
exports.PhotoUploadDataAccess = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoUploadDataAccess = exports.PhotoUploadDataAccess = function () {
    function PhotoUploadDataAccess(dbManager) {
        _classCallCheck(this, PhotoUploadDataAccess);

        this._photoUploads = dbManager.get("photoUploads");
    }

    PhotoUploadDataAccess.prototype.create = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(directoryPath) {
            var upload;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            upload = {
                                date: new Date(),
                                directoryPath: directoryPath
                            };
                            _context.next = 3;
                            return this._photoUploads.insert(upload);

                        case 3:
                            return _context.abrupt("return", _context.sent);

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function create(_x) {
            return _ref.apply(this, arguments);
        }

        return create;
    }();

    PhotoUploadDataAccess.prototype.getById = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoUploads.findOne({ _id: id }, { castIds: true });

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getById(_x2) {
            return _ref2.apply(this, arguments);
        }

        return getById;
    }();

    return PhotoUploadDataAccess;
}();