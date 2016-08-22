export let authorizationChecker = async function (ctx, next) {
    if (!ctx.request.idToken) {
        // TODO: Logging
        console.log("----- No token provided. Unauthorized. -----");

        // If a token is missing or expired, the correct status code to
        // return is 401.
        ctx.status = 401; // unauthorized (no token, or token expired)
        return;
    }

    await next();
}
