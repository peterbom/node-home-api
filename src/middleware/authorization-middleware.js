import {Log} from "../shared/log";

export let authorizationChecker = async function (ctx, next) {
    if (!ctx.request.idToken) {
        // TODO: Logging
        Log.info("Missing ID token. Returning 401 (unauthorized).");

        // If a token is missing or expired, the correct status code to
        // return is 401.
        ctx.status = 401; // unauthorized (no token, or token expired)
        return;
    }

    await next();
}
