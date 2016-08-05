import {OidcClientSettings} from "./oidc-client-settings";
import {MetadataService} from "./metadata-service";
import {HttpClientJsonService} from "./http-client-json-service";
import {Log} from "../shared/log";

export class AuthProviderManager {
    constructor(authSettings, jsonServiceFactory = () => new HttpClientJsonService()) {
        this._names = [];
        this._oidcClientSettingsLookup = {};

        for (let name in authSettings) {
            this._names.push(name);

            let providerSettings = Object.assign({}, authSettings[name], {
                jsonServiceFactory: jsonServiceFactory
            });

            this._oidcClientSettingsLookup[name] = new OidcClientSettings(providerSettings);
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
