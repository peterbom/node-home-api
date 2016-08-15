// From:
// https://github.com/IdentityModel/oidc-client-js/blob/master/src/ResponseValidator.js

// TODO: Logging
import {Log} from "../shared/log";

export class IdTokenValidator {
    constructor (authProviderManager, jwtParser, jwtValidator) {
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

    async validateIdToken(providerName, idToken) {
        let jwt = this._jwtParser.parseJwt(idToken);
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
        let metadataService = await this._authProviderManager.getMetadataService(providerName);

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

        Log.info("Matched key: kid " + JSON.stringify(key.kid));

        let settings = await this._authProviderManager.getSettings(providerName);
        let audience = settings.client_id;
        
        let clockSkewInSeconds = settings.clockSkew;
        Log.info("Validaing JWT; using clock skew (in seconds) of: ", clockSkewInSeconds);

        await this._jwtValidator.validateJwt(idToken, key, issuer, audience, clockSkewInSeconds);
        Log.info("JWT validation successful");
    }
}
