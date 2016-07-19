"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var add = exports.add = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
		var insertedUser;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						// TODO: validation
						insertedUser = addUser(ctx.body);


						ctx.set("location", "/user/" + insertedUser._id);
						ctx.status = 200;

					case 3:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function add(_x) {
		return _ref.apply(this, arguments);
	};
}();

var get = exports.get = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
		var user;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						user = findUser(ctx.params.id);

						if (user) {
							_context2.next = 4;
							break;
						}

						ctx.status = 404;
						return _context2.abrupt("return");

					case 4:

						ctx.body = user;

					case 5:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function get(_x2) {
		return _ref2.apply(this, arguments);
	};
}();

exports.findUser = findUser;
exports.addUser = addUser;
exports.clearUsers = clearUsers;
exports.update = update;
exports.remove = remove;

var _marked = [update, remove].map(regeneratorRuntime.mark);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

//import monk from "monk";

//let db = monk("localhost/usersApi");

var users = []; //db.get("users");
var id = 1;

function findUser(idVal) {
	var id = Number.parseInt(idVal);
	if (id === NaN) {
		return null;
	}

	return users.find(function (u) {
		return u._id === id;
	});
}

function addUser(userData) {
	var userObject = Object.assign({ _id: id++ }, userData);
	users.push(userObject);

	return userObject;
}

function clearUsers() {
	users = [];
}

function update(id) {
	return regeneratorRuntime.wrap(function update$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
				case "end":
					return _context3.stop();
			}
		}
	}, _marked[0], this);
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
	}, _marked[1], this);
}

/*
export async function myFunc() {
	this.body = "Yeah";
}
*/