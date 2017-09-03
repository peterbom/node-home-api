const {Log} = require("../shared/log");
const AzureStorage = require("azure-storage");

const ContainerName = "images";

async function ensureContainerExists(blobService) {
    await new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(ContainerName, error => error ? reject(error) : resolve());
    });
}

class AzureSasTokenResource {
    constructor (azureStorageConnectionString) {
        this._azureStorageConnectionString = azureStorageConnectionString;
    }

    async getToken (ctx) {
        let blobService = AzureStorage.createBlobService(this._azureStorageConnectionString);

        await ensureContainerExists(blobService, ContainerName);

        // Create a SAS token that expires in 12 hours
        // Set start time to five minutes ago to avoid clock skew.
        let startMinutes = -5;
        let expireMinutes = 12 * 60;
        let startDate = new Date();
        let expiryDate = new Date(startDate);

        startDate.setMinutes(startDate.getMinutes() + startMinutes);
        expiryDate.setMinutes(startDate.getMinutes() + expireMinutes);

        //   SharedAccessPermissions: {
        //     READ: 'r',
        //     ADD: 'a',
        //     CREATE: 'c',
        //     WRITE: 'w',
        //     DELETE: 'd',
        //     LIST: 'l'
        //   },
        let sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: "acw",
                Start: startDate,
                Expiry: expiryDate
            }
        };

        let sasToken = blobService.generateSharedAccessSignature(ContainerName, null /* blob */, sharedAccessPolicy);

        ctx.body = {
            token: sasToken,
            uri: blobService.getUrl(ContainerName, sasToken)
        };
    }
}

exports.AzureSasTokenResource = AzureSasTokenResource;