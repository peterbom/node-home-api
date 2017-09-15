const {Log} = require("../src/shared/log");
const {EnvVarsProvider} = require("../src/shared/env-vars-provider");
const {JwtUtils} = require("../src/shared/jwt-utils");

let envVarsProvider = new EnvVarsProvider();
let envVars = envVarsProvider.getEnvVars();

let jwtUtils = new JwtUtils(envVars["AUTH_PROVIDER_SECRET"]);

let user = {
    sub: "google-oauth2|106061563573452395430",
    iss: envVars["AUTH_SERVER"],
    aud: "ZZZZZZZZZZZ" // TODO: Fix when we are properly validating claims
};

let lifetimeInMinutes = 60 * 24 * 30; // valid for 30 days
let token = jwtUtils.signJwt(user, lifetimeInMinutes);

console.log(token);
