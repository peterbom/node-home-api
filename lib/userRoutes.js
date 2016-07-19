"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

/*
export function *get(id) {
	this.body = "You passed me: " + id;
}
*/

var get = exports.get = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
		return regeneratorRuntime.wrap(function _callee$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						ctx.body = "You passed me " + ctx.params.id;

					case 1:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee, this);
	}));

	return function get(_x) {
		return _ref.apply(this, arguments);
	};
}();

exports.add = add;
exports.update = update;
exports.remove = remove;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var _marked = [add, update, remove].map(regeneratorRuntime.mark);

function add() {
	return regeneratorRuntime.wrap(function add$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
				case "end":
					return _context.stop();
			}
		}
	}, _marked[0], this);
}function update(id) {
	return regeneratorRuntime.wrap(function update$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
				case "end":
					return _context3.stop();
			}
		}
	}, _marked[1], this);
}

function remove(id) {
	return regeneratorRuntime.wrap(function remove$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
				case "end":
					return _context4.stop();
			}
		}
	}, _marked[2], this);
}

/*
export async function myFunc() {
	this.body = "Yeah";
}
*/
//# sourceMappingURL=userRoutes.js.map