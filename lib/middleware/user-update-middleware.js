"use strict";

exports.__esModule = true;
exports.getUserUpdater = getUserUpdater;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function getUserUpdater(userDataAccess, jsonService, authServer) {
    if (!userDataAccess) {
        throw new Error("userDataAccess not supplied");
    }

    if (!jsonService) {
        throw new Error("jsonService not supplied");
    }

    if (!authServer) {
        throw new Error("authServer not supplied");
    }

    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
            var jwt, idToken, user;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            jwt = ctx.request.bearerTokenJwt;
                            idToken = ctx.request.idToken;

                            if (!(jwt && idToken && idToken.sub)) {
                                _context.next = 13;
                                break;
                            }

                            _context.next = 5;
                            return userDataAccess.findUser(idToken.sub);

                        case 5:
                            user = _context.sent;

                            if (user) {
                                _context.next = 13;
                                break;
                            }

                            _context.next = 9;
                            return jsonService.postJson("https://" + authServer + "/tokeninfo", {
                                id_token: jwt
                            });

                        case 9:
                            user = _context.sent;


                            Object.assign(user, { sub: idToken.sub });

                            _context.next = 13;
                            return userDataAccess.upsertUser(user);

                        case 13:
                            _context.next = 15;
                            return next();

                        case 15:
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