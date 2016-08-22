import {sign as signJwt, verify as verifyJwtLegacy} from "jsonwebtoken";
import promisify from "promisify-node";

let verifyJwt = promisify(verifyJwtLegacy);

export class JwtUtils {
    constructor (secret) {
        this._secretBuffer = new Buffer(secret, "base64");
    }

    async verifyJwt (token) {
        try {
            // verifies secret and checks expiry
            return await verifyJwt(token, this._secretBuffer);
        } catch (err) {
            // TODO: Logging
            console.trace(err);
            return null;
        }
    }

    signJwt (user, expiresInMinutes) {
        return signJwt(user, this._secretBuffer, {
            expiresIn : expiresInMinutes * 60
        });
    }
}