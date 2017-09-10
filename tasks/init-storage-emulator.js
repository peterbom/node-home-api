const {Log} = require("../src/shared/log");
const AzureStorage = require("azure-storage");

const ContainerName = "images";

async function initialiseBlobService() {
    // https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator
    let storageEmulatorConnectionString = "UseDevelopmentStorage=true"; // "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;";
    let blobService = AzureStorage.createBlobService(storageEmulatorConnectionString); //, null, "http://127.0.0.1:10000/devstoreaccount1");

    let serviceProperties = await new Promise((resolve, reject) => {
        blobService.getServiceProperties((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

    serviceProperties.Cors.CorsRule = [
        {
            "AllowedMethods": [
                "POST",
                "OPTIONS",
                "PUT",
                "DELETE",
                "GET",
                "HEAD",
                "MERGE"
            ],
            "AllowedOrigins": ["*"],
            "AllowedHeaders": ["*"],
            "ExposedHeaders": ["*"],
            "MaxAgeInSeconds": 86400
        }
    ];

    await new Promise((resolve, reject) => {
        blobService.setServiceProperties(serviceProperties, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });

    await new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(ContainerName, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

initialiseBlobService().catch(err => {
    Log.error(err);
});