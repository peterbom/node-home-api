import {OidcClientSettings} from "./oidc-client-settings";
import {MetadataService} from "./metadata-service";
import {Log} from "../shared/log";

export class AuthProviderManager {
    constructor(...providerSettingsItems) {
        this._names = providerSettingsItems.map(s => s.name);

        let oidcClientSettingsItems = providerSettingsItems.map(s => s instanceof OidcClientSettings ? s : new OidcClientSettings(s));
        this.settingsItems = oidcClientSettingsItems;
        this.metadataServices = oidcClientSettingsItems.map(s => new MetadataService(s));
    }

    get names() {
        return this._names;
    }

    getSettings(name) {
        return this.settingsItems[this._names.indexOf(name)];
    }

    getMetadataService(name) {
        return this.metadataServices[this._names.indexOf(name)];
    }

    async retrieveAllMetadata() {
        await Promise.all(this.metadataServices.map(ms => ms.getMetadata()));
    }

    async getMetadataServiceByIssuer(issuer) {
        let index = await getMetadataServicesIndex(this.metadataServices, issuer);
        if (index === -1) {
            return null;
        }

        return this.metadataServices[index];
    }

    async getSettingsByIssuer(issuer) {
        let index = await getMetadataServicesIndex(this.metadataServices, issuer);
        if (index === -1) {
            return null;
        }

        return this.settingsItems[index];
    }
}

async function getMetadataServicesIndex(metadataServices, issuer) {
    Log.info(`Getting metadata services for issuer ${issuer}`);
    let issuers = await Promise.all(metadataServices.map(ms => ms.getIssuer()));
    return issuers.indexOf(issuer);
}