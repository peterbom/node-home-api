"use strict";

exports.__esModule = true;
exports.PhotoMovementResource = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
// Old:
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
*/

var PhotoMovementResource = exports.PhotoMovementResource = function () {
    function PhotoMovementResource(photoMovementServices) {
        _classCallCheck(this, PhotoMovementResource);

        this._photoMovementServices = photoMovementServices;
    }

    PhotoMovementResource.prototype.getAll = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._photoMovementServices.getAllImagesForMovement();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getAll(_x) {
            return _ref.apply(this, arguments);
        }

        return getAll;
    }();

    PhotoMovementResource.prototype.move = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var id;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            id = ctx.params.id;
                            _context2.next = 3;
                            return this._photoMovementServices.moveImageFile(id);

                        case 3:
                            ctx.status = 200;

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function move(_x2) {
            return _ref2.apply(this, arguments);
        }

        return move;
    }();

    return PhotoMovementResource;
}();