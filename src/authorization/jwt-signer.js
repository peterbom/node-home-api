import {sign} from "jsonwebtoken";

export class JwtSigner {
    constructor (secret) {
        if (secret === undefined) {
            throw new Error("secret not defined");
        }

        this._secret = secret;
    }

    signJwt (user, expiresInMinutes) {

        return sign(user, this._secret, {
            expiresIn : expiresInMinutes * 60
        });
    }
}
