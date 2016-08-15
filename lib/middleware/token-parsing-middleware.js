"use strict";

exports.__esModule = true;
exports.bearerTokenParser = undefined;

var _jsonwebtoken = require("jsonwebtoken");

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var bearerToken = (0, _promisifyNode2.default)("bearer-token");
var verifyJwt = (0, _promisifyNode2.default)(_jsonwebtoken.verify);

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
var bearerTokenParser = exports.bearerTokenParser = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return bearerToken(ctx.request);

                    case 2:
                        token = _context.sent;

                        if (!token) {
                            _context.next = 17;
                            break;
                        }

                        if (process.env.JWT_SECRET) {
                            _context.next = 6;
                            break;
                        }

                        throw new Error("A secret must be configured to verify access tokens");

                    case 6:
                        _context.prev = 6;
                        _context.next = 9;
                        return verifyJwt(token, process.env.JWT_SECRET);

                    case 9:
                        ctx.request.accessToken = _context.sent;
                        _context.next = 17;
                        break;

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context["catch"](6);

                        // TODO: Logging
                        console.trace(_context.t0);
                        ctx.status = 400; // bad request
                        return _context.abrupt("return");

                    case 17:
                        _context.next = 19;
                        return next();

                    case 19:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this, [[6, 12]]);
    }));

    return function bearerTokenParser(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();