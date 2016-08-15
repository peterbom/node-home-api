"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticationResource = exports.AuthenticationResource = function () {
    function AuthenticationResource(authProviderManager, idTokenValidator, jwtParser, permissionManager, jwtSigner) {
        _classCallCheck(this, AuthenticationResource);

        if (authProviderManager === undefined) {
            throw new Error("authProviderManager not defined");
        }

        if (idTokenValidator === undefined) {
            throw new Error("idTokenValidator not defined");
        }

        if (jwtParser === undefined) {
            throw new Error("jwtParser not defined");
        }

        if (permissionManager === undefined) {
            throw new Error("permissionManager not defined");
        }

        if (jwtSigner === undefined) {
            throw new Error("jwtSigner not defined");
        }

        this._authProviderManager = authProviderManager;
        this._idTokenValidator = idTokenValidator;
        this._jwtParser = jwtParser;
        this._permissionManager = permissionManager;
        this._jwtSigner = jwtSigner;
    }

    AuthenticationResource.prototype.getProviders = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var manager, providers, _iterator, _isArray, _i, _ref3, provider;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            manager = this._authProviderManager;
                            _context2.next = 3;
                            return Promise.all(manager.names.map(function () {
                                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
                                    var settings, metadataService;
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    settings = manager.getSettings(name);
                                                    metadataService = manager.getMetadataService(name);
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

                        case 3:
                            providers = _context2.sent;


                            ctx.body = {};
                            _iterator = providers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 6:
                            if (!_isArray) {
                                _context2.next = 12;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context2.next = 9;
                                break;
                            }

                            return _context2.abrupt("break", 20);

                        case 9:
                            _ref3 = _iterator[_i++];
                            _context2.next = 16;
                            break;

                        case 12:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context2.next = 15;
                                break;
                            }

                            return _context2.abrupt("break", 20);

                        case 15:
                            _ref3 = _i.value;

                        case 16:
                            provider = _ref3;

                            ctx.body[provider.name] = provider;

                        case 18:
                            _context2.next = 6;
                            break;

                        case 20:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getProviders(_x) {
            return _ref.apply(this, arguments);
        }

        return getProviders;
    }();

    AuthenticationResource.prototype.authenticate = function () {
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
                            return this._idTokenValidator.validateIdToken(providerName, idToken);

                        case 6:
                            _context3.next = 14;
                            break;

                        case 8:
                            _context3.prev = 8;
                            _context3.t0 = _context3["catch"](3);

                            // TODO: Logging
                            console.log("----- Invalid id_token received. Returning 400 (bad request) -----");
                            console.trace(_context3.t0);
                            ctx.status = 400;
                            return _context3.abrupt("return");

                        case 14:
                            jwt = this._jwtParser.parseJwt(idToken);
                            user = {
                                email: jwt.payload.email,
                                name: jwt.payload.name,
                                permissions: this._permissionManager.getPermissions(jwt.payload.email)
                            };
                            token = this._jwtSigner.signJwt(user, 60 * 24);


                            ctx.body = {
                                access_token: token
                            };

                            ctx.status = 200;

                        case 19:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[3, 8]]);
        }));

        function authenticate(_x3) {
            return _ref4.apply(this, arguments);
        }

        return authenticate;
    }();

    return AuthenticationResource;
}();