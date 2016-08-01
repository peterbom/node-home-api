// From:
// https://github.com/IdentityModel/oidc-client-js/blob/master/src/ResponseValidator.js

// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import * as joseUtil from "./jose-util";
import {authProviderManager} from "../app";
import {Log} from "../shared/log";

export async function validateIdToken(idToken) {
    
    let jwt = joseUtil.parseJwt(idToken);
    if (!jwt || !jwt.header || !jwt.payload) {
        Log.error("Failed to parse id_token", jwt);
        return Promise.reject(new Error("Failed to parse id_token"));
    }

    // Skip the state check here - this is expected to have been done on the client
    // if (state.nonce !== jwt.payload.nonce) {
    //     Log.error("Invalid nonce in id_token");
    //     return Promise.reject(new Error("Invalid nonce in id_token"));
    // }

    var kid = jwt.header.kid;
    if (!kid) {
        Log.error("No kid found in id_token");
        return Promise.reject(new Error("No kid found in id_token"));
    }

    // Find the correct metadata service based on the issuer in the payload.
    let issuer = jwt.payload.iss;
    let metadataService = await authProviderManager.getMetadataServicesByIssuer(issuer);

    let keys = await metadataService.getSigningKeys();

    if (!keys) {
        Log.error("No signing keys from metadata");
        throw new Error("No signing keys from metadata");
    }

    Log.info("Received signing keys");

    let key = keys.find(key => key.kid === kid);

    if (!key) {
        Log.error("No key matching kid found in signing keys");
        throw new Error("No key matching kid found in signing keys");
    }

    let settings = await authProviderManager.getSettingsByIssuer(issuer);
    let audience = settings.client_id;
    
    let clockSkewInSeconds = settings.clockSkew;
    Log.info("Validaing JWT; using clock skew (in seconds) of: ", clockSkewInSeconds);

    await joseUtil.validateJwt(idToken, key, issuer, audience, clockSkewInSeconds);
    Log.info("JWT validation successful");
}