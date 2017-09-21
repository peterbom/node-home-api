const Log = require("./log").Log;
const jwt = require("jsonwebtoken");

const RefreshIntervalMinutes = 720; // Every 12 hours

// From https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/utils.js
function certToPem(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}

function keyToPem(key) {
    key = key.match(/.{1,64}/g).join('\n');
    key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`;
    return key;
}

class JwtUtils {
    constructor (jwksUrl, audience, issuer) {
        if (!jwksUrl || !audience || !issuer) {
            throw new Error("jwksUrl, audience and issuer must all be supplied.");
        }

        this._jwksUrl = jwksUrl;
        this._audience = audience;
        this._issuer = issuer;
        this._keys = null;
        this._renewAt = null;
    }

    async _ensureInitialized(jsonService) {
        if (this._keys && this._renewAt > new Date()) {
            return;
        }

        let {keys} = await jsonService.getJson(this._jwksUrl);
        if (!keys || !keys.length) {
            throw new Error(`No keys at JWKS endpoint ${this._jwksUrl}`);
        }

        let signingKeys = keys
            .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                        && key.kty === 'RSA' // We are only supporting RSA (RS256)
                        && key.kid           // The `kid` must be present to be useful for later
                        && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
            ).map(key => ({
                kid: key.kid,
                publicKey: certToPem(key.x5c[0])
            }));

        if (!signingKeys.length) {
            throw new Error(`No signing keys at JWKS endpoint ${this._jwksUrl}`);
        }

        this._keys = signingKeys;

        this._renewAt = new Date();
        this._renewAt.setMinutes(this._renewAt.getMinutes() + RefreshIntervalMinutes);
    }

    _getKey(kid) {
        if (!this._keys) {
            throw new Error("Not initialized");
        }

        let key = this._keys.find(key => key.kid === kid);
        if (!key) {
            throw new Error(`Unable to find a signing key that matches '${kid}'`);
        }

        return key;
    }

    async _verifyJwt(token, jsonService) {
        await this._ensureInitialized(jsonService);

        // Decode the JWT *without* verifying the signature first. This allows us to check the
        // 'kid' property from the header, so we can attempt to find a matching signing key.
        let {header} = jwt.decode(token, {complete: true});
        
        // Only RS256 is supported.
        if (header.alg !== "RS256") {
            throw new Error(`Header 'alg' value expected "RS256", found ${header.alg}`);
        }

        let key = this._getKey(header.kid);

        let verifyOptions = {
            audience: this._audience,
            issuer: this._issuer,
            algorithms: ['RS256']
        };

        // verifies secret and checks expiry
        return await new Promise((resolve, reject) => {
            jwt.verify(token, key.publicKey, (err, decoded) => err ? reject(err) : resolve(decoded));
        });
    }

    async verifyJwt (token, jsonService) {
        try {
            return await this._verifyJwt(token, jsonService);
        } catch (err) {
            Log.info("JWT failed verification", err);
            return null;
        }
    }

    signJwt (userId, signingKey, keyId, expiresInMinutes) {
        let user = {
            sub: userId
        };

        let signingKeyPem = keyToPem(signingKey);
        return jwt.sign(user, signingKeyPem, {
            algorithm: "RS256",
            expiresIn : expiresInMinutes * 60,
            audience: this._audience,
            issuer: this._issuer,
            keyid: keyId
        });
    }
}

exports.JwtUtils = JwtUtils;