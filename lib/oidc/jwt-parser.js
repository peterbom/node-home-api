'use strict';

exports.__esModule = true;
exports.JwtParser = undefined;

var _jsrsasign = require('jsrsasign');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JwtParser = exports.JwtParser = function () {
    function JwtParser() {
        _classCallCheck(this, JwtParser);
    }

    JwtParser.prototype.parseJwt = function parseJwt(jwt) {
        var token = _jsrsasign.jws.JWS.parse(jwt);
        return {
            header: token.headerObj,
            payload: token.payloadObj
        };
    };

    return JwtParser;
}();