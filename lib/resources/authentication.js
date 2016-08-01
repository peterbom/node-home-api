"use strict";

exports.__esModule = true;
exports.authenticate = undefined;

var authenticate = exports.authenticate = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
		var body, idToken;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						body = ctx.request.body;
						idToken = body.id_token || body["#id_token"];
						_context.prev = 2;
						_context.next = 5;
						return (0, _idTokenValidator.validateIdToken)(idToken);

					case 5:
						ctx.status = 200;
						_context.next = 12;
						break;

					case 8:
						_context.prev = 8;
						_context.t0 = _context["catch"](2);

						console.trace(_context.t0);
						ctx.status = 400;

					case 12:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this, [[2, 8]]);
	}));

	return function authenticate(_x) {
		return _ref.apply(this, arguments);
	};
}();

var _idTokenValidator = require("../oidc/id-token-validator");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }