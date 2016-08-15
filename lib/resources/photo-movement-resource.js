"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
// Old:
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
*/

var PhotoMovementResource = exports.PhotoMovementResource = function () {
    function PhotoMovementResource() {
        _classCallCheck(this, PhotoMovementResource);
    }

    PhotoMovementResource.prototype.move = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            ctx.status = 201;

                        case 1:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function move(_x) {
            return _ref.apply(this, arguments);
        }

        return move;
    }();

    return PhotoMovementResource;
}();