"use strict";

exports.__esModule = true;
exports.PhotoUploadResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoUploadResource = exports.PhotoUploadResource = function () {
    function PhotoUploadResource(photoUploadServices) {
        _classCallCheck(this, PhotoUploadResource);

        this._photoUploadServices = photoUploadServices;
    }

    PhotoUploadResource.prototype.create = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var upload;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoUploadServices.create();

                        case 2:
                            upload = _context.sent;


                            ctx.set("location", "/photo-upload/" + upload._id);
                            ctx.body = upload;
                            ctx.status = 201;

                        case 6:
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

    PhotoUploadResource.prototype.addFile = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var uploadId, filename, upload;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            uploadId = ctx.params.uploadId;
                            filename = ctx.params.filename;
                            _context2.next = 4;
                            return this._photoUploadServices.getUpload(uploadId);

                        case 4:
                            upload = _context2.sent;

                            if (upload) {
                                _context2.next = 9;
                                break;
                            }

                            ctx.status = 404;
                            ctx.body = "Upload id " + uploadId + " not found";
                            return _context2.abrupt("return");

                        case 9:
                            _context2.next = 11;
                            return this._photoUploadServices.addFile(upload, filename, ctx.req);

                        case 11:

                            ctx.status = 200;

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function addFile(_x2) {
            return _ref2.apply(this, arguments);
        }

        return addFile;
    }();

    return PhotoUploadResource;
}();