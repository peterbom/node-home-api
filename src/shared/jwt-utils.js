const Log = require("./log").Log;
const {sign: signJwt, verify: verifyJwtLegacy} = require("jsonwebtoken");
const promisify = require("promisify-node");

let verifyJwt = promisify(verifyJwtLegacy);

class JwtUtils {
    constructor (secret) {
        this._secretBuffer = new Buffer(secret, "base64");
    }

    async verifyJwt (token) {
        try {
            // verifies secret and checks expiry
            return await verifyJwt(token, this._secretBuffer);
        } catch (err) {
            Log.info("JWT failed verification", err);
            return null;
        }
    }

    signJwt (user, expiresInMinutes) {
        return signJwt(user, this._secretBuffer, {
            expiresIn : expiresInMinutes * 60
        });
    }
}

exports.JwtUtils = JwtUtils;