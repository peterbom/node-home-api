class AppSettingsBuilder {
    async buildSettings(envVars, secretRetriever) {
        let getEnvVar = envVarKey => {
            let result = envVars[envVarKey];
            if (result === undefined) {
                throw new Error(`Environment value ${envVarKey} has not been set`);
            }

            return result;
        };

        let envSettings = {
            nodeEnv: getEnvVar("NODE_ENV"),
            listen: true,
            port: getEnvVar("PORT"),
            logExternal: !!getEnvVar("LOG_EXTERNAL"),
            logglySubdomain: getEnvVar("LOGGLY_SUBDOMAIN"),
            logglyToken: getEnvVar("LOGGLY_TOKEN"),
            authServer: getEnvVar("AUTH_SERVER"),
            authJwksUrl: getEnvVar("AUTH_JWKS_URL"),
            authAudience: getEnvVar("AUTH_AUDIENCE"),
            authIssuer: getEnvVar("AUTH_ISSUER"),
            suppressAuthorization: getEnvVar("SUPPRESS_AUTHORIZATION") && getEnvVar("NODE_ENV") === "development",
            machineLookup: {
                dev: {
                    ipAddress: "192.168.1.200",
                    macAddress: "bc:5f:f4:36:5c:a0"
                }, flash: {
                    ipAddress: "192.168.1.100"
                }
            },
            stagingPhotoPath: getEnvVar("STAGING_PHOTO_PATH"),
            targetPhotoPath: getEnvVar("TARGET_PHOTO_PATH"),
            sshHost: getEnvVar("SSH_HOST"),
            sshPort: getEnvVar("SSH_PORT"),
            sshUsername: getEnvVar("SSH_USERNAME"),
            sshPrivateKeyPath: getEnvVar("SSH_PRIVATE_KEY_PATH"),
            localRoot: getEnvVar("LOCAL_ROOT"),
            serverRoot: getEnvVar("SERVER_ROOT")
        };

        let secretNames = {
            connectionString: "mongo-db-connection-string",
            blobStorageConnectionString: "blob-storage-connection-string",
            jobStorageConnectionString: "job-storage-connection-string"
        };

        let secretValues = {};
        await Promise.all(Object.entries(secretNames).map(async entry => {
            let key = entry[0];
            let name = entry[1];
            let result = await secretRetriever.getSecretValue(name);
            if (!result) {
                throw new Error(`Secret value ${secretName} not found`);
            }

            secretValues[key] = result;
        }));

        return Object.assign(envSettings, secretValues);
    }
}

exports.AppSettingsBuilder = AppSettingsBuilder;