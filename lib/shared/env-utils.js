"use strict";

var path = require("path");
var zoo = require("zoo");

exports = module.exports = getEnvVars();

function getEnvVars() {
    var launchDir = process.cwd();
    var envFilePath = path.join(launchDir, ".env");
    var envVars = void 0;
    try {
        envVars = zoo.get(envFilePath);
    } catch (err) {
        // E.g. no .env file exists
        envVars = process.env;
    }

    var vars = {
        nodeEnv: envVars["NODE_ENV"],
        port: envVars["PORT"],
        logglySubdomain: envVars["LOGGLY_SUBDOMAIN"],
        logglyToken: envVars["LOGGLY_TOKEN"],
        authServer: envVars["AUTH_SERVER"],
        authProviderSecret: envVars["AUTH_PROVIDER_SECRET"],
        suppressAuthorization: envVars["SUPPRESS_AUTHORIZATION"],
        logLevel: envVars["LOG_LEVEL"],
        connectionString: envVars["CONNECTION_STRING"],
        stagingPhotoPath: envVars["STAGING_PHOTO_PATH"],
        targetPhotoPath: envVars["TARGET_PHOTO_PATH"],
        sshHost: envVars["SSH_HOST"],
        sshPort: envVars["SSH_PORT"],
        sshUsername: envVars["SSH_USERNAME"],
        sshPrivateKeyPath: envVars["SSH_PRIVATE_KEY_PATH"],
        localRoot: envVars["LOCAL_ROOT"],
        serverRoot: envVars["SERVER_ROOT"]
    };

    return vars;
}