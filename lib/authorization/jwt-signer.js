"use strict";

exports.__esModule = true;
exports.JwtSigner = undefined;

var _jsonwebtoken = require("jsonwebtoken");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JwtSigner = exports.JwtSigner = function () {
    function JwtSigner(secret) {
        _classCallCheck(this, JwtSigner);

        if (secret === undefined) {
            throw new Error("secret not defined");
        }

        this._secret = secret;
    }

    JwtSigner.prototype.signJwt = function signJwt(user, expiresInMinutes) {

        return (0, _jsonwebtoken.sign)(user, this._secret, {
            expiresIn: expiresInMinutes * 60
        });
    };

    return JwtSigner;
}();