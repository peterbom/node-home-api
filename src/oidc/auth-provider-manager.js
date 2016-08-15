import {OidcClientSettings} from "./oidc-client-settings";

// TODO: Logging
import {Log} from "../shared/log";

export class AuthProviderManager {
    constructor(authSettings, jsonService) {
        if (authSettings === undefined) {
            throw new Error("authSettings not defined");
        }

        if (jsonService === undefined) {
            throw new Error("jsonService not defined");
        }

        this._names = [];
        this._oidcClientSettingsLookup = {};

        for (let name in authSettings) {
            this._names.push(name);
            this._oidcClientSettingsLookup[name] = new OidcClientSettings(authSettings[name], jsonService);
        }
    }

    get names() {
        return this._names;
    }

    getSettings(name) {
        return this._oidcClientSettingsLookup[name];
    }

    getMetadataService(name) {
        return this._oidcClientSettingsLookup[name].metadataService;
    }

    async retrieveAllMetadata() {
        await Promise.all(this.names.map(name => this.getMetadataService(name).getMetadata()));
    }
}
