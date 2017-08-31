const path = require("path");
const zoo = require("zoo");

exports = module.exports = getEnvVars();

function getEnvVars() {
    let launchDir = process.cwd();
    let envFilePath = path.join(launchDir, ".env");
    let envFileVars;
    try {
        envFileVars = zoo.get(envFilePath);
    } catch (err) {
        // E.g. no .env file exists
        envFileVars = process.env;
    }

    // Let environment variables take precedence over those defined in a file (so that we can
    // override file variables using launch arguments).
    let resolveVar = varName => process.env[varName] !== undefined ? process.env[varName] : envFileVars[varName];

    let vars = {
        isUnitTest: !!resolveVar("IS_UNIT_TEST"),
        nodeEnv: resolveVar("NODE_ENV"),
        port: resolveVar("PORT"),
        logglySubdomain: resolveVar("LOGGLY_SUBDOMAIN"),
        logglyToken: resolveVar("LOGGLY_TOKEN"),
        authServer: resolveVar("AUTH_SERVER"),
        authProviderSecret: resolveVar("AUTH_PROVIDER_SECRET"),
        suppressAuthorization: resolveVar("SUPPRESS_AUTHORIZATION"),
        logLevel: resolveVar("LOG_LEVEL"),
        connectionString: resolveVar("CONNECTION_STRING"),
        stagingPhotoPath: resolveVar("STAGING_PHOTO_PATH"),
        targetPhotoPath: resolveVar("TARGET_PHOTO_PATH"),
        sshHost: resolveVar("SSH_HOST"),
        sshPort: resolveVar("SSH_PORT"),
        sshUsername: resolveVar("SSH_USERNAME"),
        sshPrivateKeyPath: resolveVar("SSH_PRIVATE_KEY_PATH"),
        localRoot: resolveVar("LOCAL_ROOT"),
        serverRoot: resolveVar("SERVER_ROOT")
    }

    return vars;
}