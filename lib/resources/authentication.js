"use strict";

exports.__esModule = true;
exports.authenticate = exports.getProviders = undefined;

var getProviders = exports.getProviders = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var providers, _iterator, _isArray, _i, _ref3, provider;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return Promise.all(_globals.authProviderManager.names.map(function () {
                            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
                                var settings, metadataService;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                settings = _globals.authProviderManager.getSettings(name);
                                                metadataService = _globals.authProviderManager.getMetadataService(name);
                                                _context.t0 = name;
                                                _context.t1 = settings.client_id;
                                                _context.t2 = settings.authority;
                                                _context.next = 7;
                                                return metadataService.getIssuer();

                                            case 7:
                                                _context.t3 = _context.sent;
                                                _context.next = 10;
                                                return metadataService.getAuthorizationEndpoint();

                                            case 10:
                                                _context.t4 = _context.sent;
                                                _context.next = 13;
                                                return metadataService.getSigningKeys();

                                            case 13:
                                                _context.t5 = _context.sent;
                                                return _context.abrupt("return", {
                                                    name: _context.t0,
                                                    clientId: _context.t1,
                                                    authority: _context.t2,
                                                    issuer: _context.t3,
                                                    authorizationEndpoint: _context.t4,
                                                    signingKeys: _context.t5
                                                });

                                            case 15:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, this);
                            }));

                            return function (_x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }()));

                    case 2:
                        providers = _context2.sent;


                        ctx.body = {};
                        _iterator = providers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                    case 5:
                        if (!_isArray) {
                            _context2.next = 11;
                            break;
                        }

                        if (!(_i >= _iterator.length)) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.abrupt("break", 19);

                    case 8:
                        _ref3 = _iterator[_i++];
                        _context2.next = 15;
                        break;

                    case 11:
                        _i = _iterator.next();

                        if (!_i.done) {
                            _context2.next = 14;
                            break;
                        }

                        return _context2.abrupt("break", 19);

                    case 14:
                        _ref3 = _i.value;

                    case 15:
                        provider = _ref3;

                        ctx.body[provider.name] = provider;

                    case 17:
                        _context2.next = 5;
                        break;

                    case 19:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function getProviders(_x) {
        return _ref.apply(this, arguments);
    };
}();

var authenticate = exports.authenticate = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
        var body, providerName, idToken, jwt, user, token;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        body = ctx.request.body;
                        providerName = body.provider;
                        idToken = body.id_token;
                        _context3.prev = 3;
                        _context3.next = 6;
                        return (0, _idTokenValidator.validateIdToken)(providerName, idToken);

                    case 6:
                        _context3.next = 13;
                        break;

                    case 8:
                        _context3.prev = 8;
                        _context3.t0 = _context3["catch"](3);

                        console.trace(_context3.t0);
                        ctx.status = 400;
                        return _context3.abrupt("return");

                    case 13:
                        if (process.env.JWT_SECRET) {
                            _context3.next = 15;
                            break;
                        }

                        throw new Error("A secret must be configured to sign an access token");

                    case 15:
                        jwt = (0, _joseUtil.parseJwt)(idToken);
                        user = {
                            email: jwt.payload.email,
                            name: jwt.payload.name,
                            permissions: (0, _permissionManager.getPermissions)(jwt.payload.email)
                        };
                        token = (0, _jsonwebtoken.sign)(user, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24 // 24 hours
                        });


                        ctx.body = {
                            access_token: token
                        };

                        ctx.status = 200;

                    case 20:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[3, 8]]);
    }));

    return function authenticate(_x3) {
        return _ref4.apply(this, arguments);
    };
}();

var _jsonwebtoken = require("jsonwebtoken");

var _joseUtil = require("../oidc/jose-util");

var _idTokenValidator = require("../oidc/id-token-validator");

var _globals = require("../globals");

var _permissionManager = require("../authorization/permission-manager");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }