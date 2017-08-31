const Log = require("../shared/log").Log;
const promisify = require("promisify-node");

let bearerToken = promisify("bearer-token");

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
exports.getBearerTokenParser = jwtUtils => {

    return async function (ctx, next) {

        let jwt = await bearerToken(ctx.request);
        if (jwt) {
            ctx.request.bearerTokenJwt = jwt;

            let idToken = await jwtUtils.verifyJwt(jwt);
            if (!idToken) {
                // No need to log here - it'll already have been logged by the verifyJwt method
                ctx.status = 400; // bad request
                return;
            }

            if (!idToken.sub) {
                Log.warn("Invalid id_token (no sub specified)");
                ctx.status = 400;
                return;
            }

            ctx.request.idToken = idToken;
        }

        await next();
    }
}
