"use strict";

exports.__esModule = true;
exports.getBearerTokenParser = getBearerTokenParser;

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var bearerToken = (0, _promisifyNode2.default)("bearer-token");

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
function getBearerTokenParser(jwtUtils) {

    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
            var jwt, idToken;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return bearerToken(ctx.request);

                        case 2:
                            jwt = _context.sent;

                            if (!jwt) {
                                _context.next = 16;
                                break;
                            }

                            ctx.request.bearerTokenJwt = jwt;

                            _context.next = 7;
                            return jwtUtils.verifyJwt(jwt);

                        case 7:
                            idToken = _context.sent;

                            if (idToken) {
                                _context.next = 11;
                                break;
                            }

                            ctx.status = 400; // bad request
                            return _context.abrupt("return");

                        case 11:
                            if (idToken.sub) {
                                _context.next = 15;
                                break;
                            }

                            console.log("invalid id_token (no sub specified)");
                            ctx.status = 400;
                            return _context.abrupt("return");

                        case 15:

                            ctx.request.idToken = idToken;

                        case 16:
                            _context.next = 18;
                            return next();

                        case 18:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
}