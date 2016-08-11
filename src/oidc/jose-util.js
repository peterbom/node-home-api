// Copied from:
// https://github.com/IdentityModel/oidc-client-js/blob/master/src/JoseUtil.js

// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { jws, KEYUTIL as KeyUtil, X509, crypto, hextob64u } from 'jsrsasign';
import {Log} from "../shared/log";

const AllowedSigningAlgs = ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'ES256', 'ES384', 'ES512'];

export function parseJwt(jwt) {
    Log.info("parseJwt");
    try {
        var token = jws.JWS.parse(jwt);
        return {
            header: token.headerObj,
            payload: token.payloadObj
        }
    }
    catch (e) {
        Log.error(e);
    }
}

export function validateJwt(jwt, key, issuer, audience, clockSkew, now) {
    Log.info("validateJwt");

    try {
        if (key.kty === "RSA") {
            if (key.e && key.n) {
                key = KeyUtil.getKey(key);
            }
            else if (key.x5c && key.x5c.length) {
                key = KeyUtil.getKey(X509.getPublicKeyFromCertPEM(key.x5c[0]));
            }
            else {
                Log.error("RSA key missing key material", key);
                return Promise.reject(new Error("RSA key missing key material"));
            }
        }
        else if (key.kty === "EC") {
            if (key.crv && key.x && key.y) {
                key = KeyUtil.getKey(key);
            }
            else {
                Log.error("EC key missing key material", key);
                return Promise.reject(new Error("EC key missing key material"));
            }
        }
        else {
            Log.error("Unsupported key type", key && key.kty);
            return Promise.reject(new Error("Unsupported key type: " + key && key.kty));
        }

        return _validateJwt(jwt, key, issuer, audience, clockSkew, now);
    }
    catch (e) {
        Log.error(e && e.message || e);
        return Promise.reject("JWT validation failed");
    }
}

function _validateJwt(jwt, key, issuer, audience, clockSkew, now) {
    Log.info("_validateJwt");

    if (!clockSkew) {
        clockSkew = 0;
    }

    if (!now) {
        now = parseInt(Date.now() / 1000);
    }

    var payload = parseJwt(jwt).payload;

    if (payload.iss !== issuer) {
        Log.error("Invalid issuer in token", payload.iss);
        return Promise.reject(new Error("Invalid issuer in token: " + payload.iss));
    }

    if (payload.aud !== audience) {
        Log.error("Invalid audience in token", payload.aud);
        return Promise.reject(new Error(`Invalid audience in token.\n Expected: ${audience}\n Actual: ${payload.aud}`));
    }

    var lowerNow = now + clockSkew;
    var upperNow = now - clockSkew;

    if (lowerNow < payload.iat) {
        let message = `iat is in the future.
        Now: ${now} (${new Date(now * 1000)})
        Lower limit: ${lowerNow} (${new Date(lowerNow * 1000)})
        iat: ${payload.iat} (${new Date(payload.iat * 1000)})`;
        Log.error(message);
        return Promise.reject(new Error(message));
    }

    if (lowerNow < payload.nbf) {
        let message = `nbf ${payload.nbf} is in the future (after ${lowerNow})`;
        Log.error(message);
        return Promise.reject(new Error(message));
    }

    if (payload.exp < upperNow) {
        let message = `exp ${payload.exp} is in the past (earlier than ${upperNow})`;
        Log.error(message);
        return Promise.reject(new Error(message));
    }

    try {
        if (!jws.JWS.verify(jwt, key, AllowedSigningAlgs)) {
            Log.error("signature validation failed");
            return Promise.reject(new Error("signature validation failed"));
        }
    }
    catch (e) {
        Log.error(e && e.message || e);
        return Promise.reject(new Error("signature validation failed"));
    }

    return Promise.resolve();
}

export function hashString(value, alg) {
    Log.info("hashString", value, alg);
    try {
        return crypto.Util.hashString(value, alg);
    }
    catch (e) {
        Log.error(e);
    }
}

export function hexToBase64Url(value) {
    Log.info("hexToBase64Url", value);
    try {
        return hextob64u(value);
    }
    catch (e) {
        Log.error(e);
    }
}
