"use strict";

exports.__esModule = true;
exports.JwtUtils = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _verifyJwt = (0, _promisifyNode2.default)(_jsonwebtoken.verify);

var JwtUtils = exports.JwtUtils = function () {
    function JwtUtils(secret) {
        _classCallCheck(this, JwtUtils);

        this._secretBuffer = new Buffer(secret, "base64");
    }

    JwtUtils.prototype.verifyJwt = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(token) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _verifyJwt(token, this._secretBuffer);

                        case 3:
                            return _context.abrupt("return", _context.sent);

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context["catch"](0);

                            // TODO: Logging
                            console.trace(_context.t0);
                            return _context.abrupt("return", null);

                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6]]);
        }));

        function verifyJwt(_x) {
            return _ref.apply(this, arguments);
        }

        return verifyJwt;
    }();

    JwtUtils.prototype.signJwt = function signJwt(user, expiresInMinutes) {
        return (0, _jsonwebtoken.sign)(user, this._secretBuffer, {
            expiresIn: expiresInMinutes * 60
        });
    };

    return JwtUtils;
}();