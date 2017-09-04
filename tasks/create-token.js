const {Log} = require("../src/shared/log");
const {EnvVarsProvider} = require("../src/shared/env-vars-provider");
const {JwtUtils} = require("../src/shared/jwt-utils");

// const {AzureSecretRetriever} = require("../src/shared/azure-secret-retriever");
// const {AppSettingsBuilder} = require("../src/shared/app-settings-builder");
// const {AppLauncher} = require("../src/app-launcher");
// const config = require("../src/config");

let envVarsProvider = new EnvVarsProvider();
let envVars = envVarsProvider.getEnvVars();

let jwtUtils = new JwtUtils(envVars["AUTH_PROVIDER_SECRET"]);

let user = {
    sub: "google-oauth2|106061563573452395430",
    iss: envVars["AUTH_SERVER"],
    aud: "ZZZZZZZZZZZ" // TODO: Fix when we are properly validating claims
};

let lifetimeInMinutes = 60 * 12; // valid for 12 hours
let token = jwtUtils.signJwt(user, lifetimeInMinutes);

console.log(token);
