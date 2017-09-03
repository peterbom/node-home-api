const url = require("url");
const KeyVault = require('azure-keyvault');
const { AuthenticationContext } = require('adal-node');

class AzureSecretRetriever {
    constructor(applicationId, applicationKey, vaultUri) {
        this._vaultUri = vaultUri;
        this._secretAuthenticator = (challenge, callback) => {
            let context = new AuthenticationContext(challenge.authorization);

            // Use the context to acquire an authentication token.
            return context.acquireTokenWithClientCredentials(
                challenge.resource,
                applicationId,
                applicationKey,
                (err, tokenResponse) => {
                    if (err) throw err;

                    // Calculate the value to be set in the request's Authorization header and resume the call.
                    let authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
                    return callback(null, authorizationValue);
                });
        };
    }

    async getSecretValue(secretName) {
        let credentials = new KeyVault.KeyVaultCredentials(this._secretAuthenticator);
        let keyVaultClient = new KeyVault.KeyVaultClient(credentials);

        let secretUri = url.resolve(this._vaultUri, `secrets/${secretName}`);
        let resultItem = await keyVaultClient.getSecret(secretUri);
        return resultItem && resultItem.value || null;
    }
}

exports.AzureSecretRetriever = AzureSecretRetriever;