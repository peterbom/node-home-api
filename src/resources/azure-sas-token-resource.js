const {Log} = require("../shared/log");
const AzureStorage = require("azure-storage");

const BlobContainerName = "images";
const QueueName = "client-requests";

function getSharedAccessPolicy(expireInMinutes, permissions) {
    // Set start time to five minutes ago to avoid clock skew.
    let startMinutes = -5;
    let expireMinutes = expireInMinutes;
    let startDate = new Date();
    let expiryDate = new Date(startDate);

    startDate.setMinutes(startDate.getMinutes() + startMinutes);
    expiryDate.setMinutes(startDate.getMinutes() + expireMinutes);

    return {
        AccessPolicy: {
            Permissions: permissions,
            Start: startDate,
            Expiry: expiryDate
        }
    };
}

async function getBlobContainerSasToken(blobStorageConnectionString, sharedAccessPolicy) {
    let blobService = AzureStorage.createBlobService(blobStorageConnectionString);

    // Bit of a side-effect here. We need to ensure the container exists before we can create
    // a token which gives access to it.
    await new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(BlobContainerName, error => error ? reject(error) : resolve());
    });

    let token = blobService.generateSharedAccessSignature(BlobContainerName, null /* blob */, sharedAccessPolicy);
    return {
        token: token,
        host: blobService.host,
        container: BlobContainerName
    }
}

async function getQueueSasToken(jobStorageConnectionString, sharedAccessPolicy) {
    let queueService = AzureStorage.createQueueService(jobStorageConnectionString);

    // Ensure the container exists before we can create a token which gives access to it.
    await new Promise((resolve, reject) => {
        queueService.createQueueIfNotExists(QueueName, error => error ? reject(error) : resolve());
    });

    let token = queueService.generateSharedAccessSignature(QueueName, sharedAccessPolicy);
    return {
        token: token,
        host: queueService.host,
        queue: QueueName
    };
}

class AzureSasTokenResource {
    constructor (blobStorageConnectionString, jobStorageConnectionString) {
        this._blobStorageConnectionString = blobStorageConnectionString;
        this._jobStorageConnectionString = jobStorageConnectionString;
    }

    async getToken (ctx) {
        // Blob permissions: {
        //     READ: 'r',
        //     ADD: 'a',
        //     CREATE: 'c',
        //     WRITE: 'w',
        //     DELETE: 'd',
        //     LIST: 'l'
        // }
        let blobPermissions = 'racwl';

        // Queue permissions: {
        //     READ: 'r',
        //     ADD: 'a',
        //     UPDATE: 'u',
        //     PROCESS: 'p'
        // }
        let queuePermissions = 'rau';

        // Create a SAS token that expires in 12 hours
        let blobSharedAccessPolicy = getSharedAccessPolicy(12 * 60, blobPermissions);
        let queueSharedAccessPolicy = getSharedAccessPolicy(12 * 60, queuePermissions);

        let blobTokenInfo = await getBlobContainerSasToken(this._blobStorageConnectionString, blobSharedAccessPolicy);
        let queueTokenInfo = await getQueueSasToken(this._jobStorageConnectionString, queueSharedAccessPolicy);
    
        ctx.body = {
            blob: blobTokenInfo,
            queue: queueTokenInfo
        };
    }
}

exports.AzureSasTokenResource = AzureSasTokenResource;