// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import {OidcClientSettings} from "./oidc-client-settings";
import {Log} from "../shared/log";
import rp from "request-promise";

export class MetadataService {
    constructor(settings) {
        if (!settings) {
            Log.error("No settings passed to MetadataService");
            throw new Error("settings");
        }

        if (settings instanceof OidcClientSettings) {
            this._settings = settings;
        }
        else {
            this._settings = new OidcClientSettings(settings);
        }
    }

    async getMetadata() {
        Log.info("MetadataService.getMetadata");

        if (this._settings.metadata) {
            Log.info("Returning metadata from settings");
            return this._settings.metadata;
        }

        if (!this._settings.metadataUrl) {
            Log.error("No metadataUrl configured on settings");
            throw new Error("No metadataUrl configured on settings");
        }

        let requestOptions = {
            uri: this._settings.metadataUrl,
            json: true
        };

        Log.info("getting metadata from", this._settings.metadataUrl);
        let metadata = await rp(requestOptions);

        Log.info("json received");
        this._settings.metadata = metadata;
        return metadata;
    }
    
    async getIssuer() {
        Log.info("MetadataService.getIssuer");
        return await this._getMetadataProperty("issuer");
    }

    async getAuthorizationEndpoint() {
        Log.info("MetadataService.getAuthorizationEndpoint");
        return await this._getMetadataProperty("authorization_endpoint");
    }

    async getUserInfoEndpoint() {
        Log.info("MetadataService.getUserInfoEndpoint");
        return await this._getMetadataProperty("userinfo_endpoint");
    }
    
    async getCheckSessionIframe() {
        Log.info("MetadataService.getCheckSessionIframe");
        return await this._getMetadataProperty("check_session_iframe");
    }

    async getEndSessionEndpoint() {
        Log.info("MetadataService.getEndSessionEndpoint");
        return await this._getMetadataProperty("end_session_endpoint");
    }

    async _getMetadataProperty(name) {
        Log.info("MetadataService._getMetadataProperty", name);

        let metadata = await this.getMetadata();

        Log.info("metadata recieved");

        if (metadata[name] === undefined) {
            Log.error("Metadata does not contain property " + name);
            throw new Error("Metadata does not contain property " + name);
        }

        return metadata[name];
    }

    async getSigningKeys() {
        Log.info("MetadataService.getSigningKeys");

        if (this._settings.signingKeys) {
            Log.info("Returning signingKeys from settings");
            return this._settings.signingKeys;
        }

        let jwks_uri = await this._getMetadataProperty("jwks_uri");

        Log.info("jwks_uri received", jwks_uri);

        let requestOptions = {
            uri: jwks_uri,
            json: true
        };

        let keySet = await rp(requestOptions);

        Log.info("key set received", keySet);

        if (!keySet.keys) {
            Log.error("Missing keys on keyset");
            throw new Error("Missing keys on keyset");
        }

        var filteredKeys = this._filterSigningKeys(keySet.keys);
        Log.info("filtered keys", filteredKeys);

        this._settings.signingKeys = filteredKeys;
        return this._settings.signingKeys;
    }

    _filterSigningKeys(keys) {
        Log.info("MetadataService._filterSigningKeys", keys);

        return keys.filter(item => {
            return item.use === "sig";
        });
    }
}