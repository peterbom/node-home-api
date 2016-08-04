'use strict';

exports.__esModule = true;

var errorHandler = exports.errorHandler = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return next();

                    case 3:
                        _context.next = 10;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context['catch'](0);

                        // https://developer.mozilla.org/en-US/docs/Web/API/Console/trace
                        console.trace(_context.t0);

                        ctx.status = _context.t0.status || 500;
                        ctx.app.emit('error', _context.t0, ctx);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 5]]);
    }));

    return function errorHandler(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }