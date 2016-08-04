import {verify as verifyJwtLegacy} from "jsonwebtoken";
import promisify from "promisify-node";

let bearerToken = promisify("bearer-token");
let verifyJwt = promisify(verifyJwtLegacy);

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
export let bearerTokenParser = async function (ctx, next) {
    let token = await bearerToken(ctx.request);
    if (token) {
        if (!process.env.JWT_SECRET) {
            throw new Error("A secret must be configured to verify access tokens");
        }

        try {
            // verifies secret and checks expiry
            ctx.request.accessToken = await verifyJwt(token, process.env.JWT_SECRET);
        } catch (err) {
            console.trace(err);
            ctx.status = 400; // bad request
            return;
        }
    } else {
        ctx.status = 403; // forbidden (no token)
        return;
    }

    await next();
}
