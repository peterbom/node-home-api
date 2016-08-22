import promisify from "promisify-node";

let bearerToken = promisify("bearer-token");

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
export function getBearerTokenParser(jwtUtils) {

    return async function (ctx, next) {

        let jwt = await bearerToken(ctx.request);
        if (jwt) {
            ctx.request.bearerTokenJwt = jwt;

            let idToken = await jwtUtils.verifyJwt(jwt);
            if (!idToken) {
                ctx.status = 400; // bad request
                return;
            }

            if (!idToken.sub) {
                console.log("invalid id_token (no sub specified)");
                ctx.status = 400;
                return;
            }

            ctx.request.idToken = idToken;
        }

        await next();
    }
}
