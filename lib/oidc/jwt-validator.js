'use strict';

exports.__esModule = true;
exports.JwtValidator = undefined;
exports.hashString = hashString;
exports.hexToBase64Url = hexToBase64Url;

var _jsrsasign = require('jsrsasign');

var _log = require('../shared/log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: Logging


var AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

var JwtValidator = exports.JwtValidator = function () {
    function JwtValidator(jwtParser) {
        _classCallCheck(this, JwtValidator);

        if (jwtParser === undefined) {
            throw new Error("jwtParser not defined");
        }

        this._jwtParser = jwtParser;
    }

    JwtValidator.prototype.validateJwt = function validateJwt(jwt, key, issuer, audience, clockSkew, now) {

        try {
            if (key.kty === "RSA") {
                if (key.e && key.n) {
                    key = _jsrsasign.KEYUTIL.getKey(key);
                } else if (key.x5c && key.x5c.length) {
                    key = _jsrsasign.KEYUTIL.getKey(_jsrsasign.X509.getPublicKeyFromCertPEM(key.x5c[0]));
                } else {
                    _log.Log.error("RSA key missing key material", key);
                    return Promise.reject(new Error("RSA key missing key material"));
                }
            } else if (key.kty === "EC") {
                if (key.crv && key.x && key.y) {
                    key = _jsrsasign.KEYUTIL.getKey(key);
                } else {
                    _log.Log.error("EC key missing key material", key);
                    return Promise.reject(new Error("EC key missing key material"));
                }
            } else {
                _log.Log.error("Unsupported key type", key && key.kty);
                return Promise.reject(new Error("Unsupported key type: " + key && key.kty));
            }

            return _validateJwt(jwt, this._jwtParser, key, issuer, audience, clockSkew, now);
        } catch (e) {
            _log.Log.error(e && e.message || e);
            return Promise.reject("JWT validation failed");
        }
    };

    return JwtValidator;
}();

function _validateJwt(jwt, jwtParser, key, issuer, audience, clockSkew, now) {
    _log.Log.info("_validateJwt");

    if (!clockSkew) {
        clockSkew = 0;
    }

    if (!now) {
        now = parseInt(Date.now() / 1000);
    }

    var payload = jwtParser.parseJwt(jwt).payload;

    if (payload.iss !== issuer) {
        _log.Log.error("Invalid issuer in token", payload.iss);
        return Promise.reject(new Error("Invalid issuer in token: " + payload.iss));
    }

    if (payload.aud !== audience) {
        _log.Log.error("Invalid audience in token", payload.aud);
        return Promise.reject(new Error('Invalid audience in token.\n Expected: ' + audience + '\n Actual: ' + payload.aud));
    }

    var lowerNow = now + clockSkew;
    var upperNow = now - clockSkew;

    if (lowerNow < payload.iat) {
        var message = 'iat is in the future.\n        Now: ' + now + ' (' + new Date(now * 1000) + ')\n        Lower limit: ' + lowerNow + ' (' + new Date(lowerNow * 1000) + ')\n        iat: ' + payload.iat + ' (' + new Date(payload.iat * 1000) + ')';
        _log.Log.error(message);
        return Promise.reject(new Error(message));
    }

    if (lowerNow < payload.nbf) {
        var _message = 'nbf ' + payload.nbf + ' is in the future (after ' + lowerNow + ')';
        _log.Log.error(_message);
        return Promise.reject(new Error(_message));
    }

    if (payload.exp < upperNow) {
        var _message2 = 'exp ' + payload.exp + ' is in the past (earlier than ' + upperNow + ')';
        _log.Log.error(_message2);
        return Promise.reject(new Error(_message2));
    }

    try {
        if (!_jsrsasign.jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
            _log.Log.error("signature validation failed");
            return Promise.reject(new Error("signature validation failed"));
        }
    } catch (e) {
        _log.Log.error(e && e.message || e);
        return Promise.reject(new Error("signature validation failed"));
    }

    return Promise.resolve();
}

function hashString(value, alg) {
    _log.Log.info("hashString", value, alg);
    try {
        return _jsrsasign.crypto.Util.hashString(value, alg);
    } catch (e) {
        _log.Log.error(e);
    }
}

function hexToBase64Url(value) {
    _log.Log.info("hexToBase64Url", value);
    try {
        return (0, _jsrsasign.hextob64u)(value);
    } catch (e) {
        _log.Log.error(e);
    }
}