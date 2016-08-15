"use strict";

exports.__esModule = true;
exports.IdTokenValidator = undefined;

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // From:
// https://github.com/IdentityModel/oidc-client-js/blob/master/src/ResponseValidator.js

// TODO: Logging


var IdTokenValidator = exports.IdTokenValidator = function () {
        function IdTokenValidator(authProviderManager, jwtParser, jwtValidator) {
                _classCallCheck(this, IdTokenValidator);

                if (authProviderManager === undefined) {
                        throw new Error("authProviderManager not defined");
                }

                if (jwtParser === undefined) {
                        throw new Error("jwtParser not defined");
                }

                if (jwtValidator === undefined) {
                        throw new Error("jwtValidator not defined");
                }

                this._authProviderManager = authProviderManager;
                this._jwtParser = jwtParser;
                this._jwtValidator = jwtValidator;
        }

        IdTokenValidator.prototype.validateIdToken = function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(providerName, idToken) {
                        var jwt, kid, issuer, metadataService, keys, key, settings, audience, clockSkewInSeconds;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                        switch (_context.prev = _context.next) {
                                                case 0:
                                                        jwt = this._jwtParser.parseJwt(idToken);

                                                        if (!(!jwt || !jwt.header || !jwt.payload)) {
                                                                _context.next = 4;
                                                                break;
                                                        }

                                                        _log.Log.error("Failed to parse id_token", jwt);
                                                        return _context.abrupt("return", Promise.reject(new Error("Failed to parse id_token")));

                                                case 4:

                                                        // Skip the state check here - this is expected to have been done on the client
                                                        // if (state.nonce !== jwt.payload.nonce) {
                                                        //     Log.error("Invalid nonce in id_token");
                                                        //     return Promise.reject(new Error("Invalid nonce in id_token"));
                                                        // }

                                                        kid = jwt.header.kid;

                                                        if (kid) {
                                                                _context.next = 8;
                                                                break;
                                                        }

                                                        _log.Log.error("No kid found in id_token");
                                                        return _context.abrupt("return", Promise.reject(new Error("No kid found in id_token")));

                                                case 8:

                                                        // Find the correct metadata service based on the issuer in the payload.
                                                        issuer = jwt.payload.iss;
                                                        _context.next = 11;
                                                        return this._authProviderManager.getMetadataService(providerName);

                                                case 11:
                                                        metadataService = _context.sent;
                                                        _context.next = 14;
                                                        return metadataService.getSigningKeys();

                                                case 14:
                                                        keys = _context.sent;

                                                        if (keys) {
                                                                _context.next = 18;
                                                                break;
                                                        }

                                                        _log.Log.error("No signing keys from metadata");
                                                        throw new Error("No signing keys from metadata");

                                                case 18:

                                                        _log.Log.info("Received signing keys");

                                                        key = keys.find(function (key) {
                                                                return key.kid === kid;
                                                        });

                                                        if (key) {
                                                                _context.next = 23;
                                                                break;
                                                        }

                                                        _log.Log.error("No key matching kid found in signing keys");
                                                        throw new Error("No key matching kid found in signing keys");

                                                case 23:

                                                        _log.Log.info("Matched key: kid " + JSON.stringify(key.kid));

                                                        _context.next = 26;
                                                        return this._authProviderManager.getSettings(providerName);

                                                case 26:
                                                        settings = _context.sent;
                                                        audience = settings.client_id;
                                                        clockSkewInSeconds = settings.clockSkew;

                                                        _log.Log.info("Validaing JWT; using clock skew (in seconds) of: ", clockSkewInSeconds);

                                                        _context.next = 32;
                                                        return this._jwtValidator.validateJwt(idToken, key, issuer, audience, clockSkewInSeconds);

                                                case 32:
                                                        _log.Log.info("JWT validation successful");

                                                case 33:
                                                case "end":
                                                        return _context.stop();
                                        }
                                }
                        }, _callee, this);
                }));

                function validateIdToken(_x, _x2) {
                        return _ref.apply(this, arguments);
                }

                return validateIdToken;
        }();

        return IdTokenValidator;
}();