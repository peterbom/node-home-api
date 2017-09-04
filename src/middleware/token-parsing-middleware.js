const Log = require("../shared/log").Log;
const promisify = require("promisify-node");

let bearerToken = promisify("bearer-token");

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
exports.getBearerTokenParser = jwtUtils => {

    return async function (ctx, next) {

        let jwt = await bearerToken(ctx.request);
        if (jwt) {
            // JWT was supplied, but we still need to check whether it's valid.
            ctx.request.bearerTokenJwt = jwt;

            let idToken = await jwtUtils.verifyJwt(jwt);
            if (!idToken) {
                // No need to log here - it'll already have been logged by the verifyJwt method
                // The token could not be verified, for example it might be expired. In these
                // circumstances we should return 401 ( https://tools.ietf.org/html/rfc7235#section-3.1 )
                ctx.status = 401; // Unauthorized
                return;
            }

            if (!idToken.sub) {
                Log.warn("Invalid id_token (no sub specified)");
                // This is another kind of invalid token.
                ctx.status = 401;
                return;
            }

            // TODO: Validate iss and aud claims.
            // See: https://auth0.com/docs/api-auth/tutorials/verify-access-token

            ctx.request.idToken = idToken;
        }

        await next();
    }
}
