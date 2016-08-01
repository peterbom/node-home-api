import {OidcClientSettings} from "./oidc-client-settings";
import {MetadataService} from "./metadata-service";
import {Log} from "../shared/log";

export class AuthProviderManager {
    constructor(...providerSettingsItems) {
        providerSettingsItems = providerSettingsItems.map(s => s instanceof OidcClientSettings ? s : new OidcClientSettings(s));
        this.settingsItems = providerSettingsItems;
        this.metadataServices = providerSettingsItems.map(s => new MetadataService(s));
    }

    async retrieveAllMetadata() {
        await Promise.all(this.metadataServices.map(ms => ms.getMetadata()));
    }

    async getMetadataServicesByIssuer(issuer) {
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