export let authorizationChecker = async function (ctx, next) {
    if (!ctx.request.accessToken) {
        // TODO: Logging
        console.log("----- No token provided. Forbidden. -----");
        ctx.status = 403; // forbidden (no token)
        return;
    }

    // TODO: Permission checking

    await next();
}