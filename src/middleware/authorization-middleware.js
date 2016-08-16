export let authorizationChecker = async function (ctx, next) {
    if (!ctx.request.accessToken) {
        // TODO: Logging
        console.log("----- No token provided. Unauthorized. -----");

        // If a token is missing or expired, the correct status code to
        // return is 401.
        ctx.status = 401; // unauthorized (no token, or token expired)
        return;
    }

    await next();
}

export function getSecureRouteHandler(routeHandler, securityResourceName, securityActionName) {

    if (!securityResourceName && !securityActionName) {
        // No security checking needed.
        return routeHandler;
    }

    if (!securityResourceName) {
        throw new Error(`Resource is not secured but no security action ${securityActionName} is specified`);
    }

    if (!securityActionName) {
        throw new Error(`Resource is secured with ${securityResourceName} but no security action name is specified`);
    }

    return async function (ctx) {
        let accessToken = ctx.request.accessToken;
        if (!accessToken) {
            // This is an error because we shouldn't even reach this middleware without an access token.
            throw new Error(`Resource is secured by ${securityActionName} on ${securityResourceName} but no access token is provided`);
        }

        if (!accessToken.permissions) {
            throw new Error("no permissions collection found on access token");
        }

        let requiredPermission = `${securityResourceName}_${securityActionName}`;

        if (accessToken.permissions.indexOf(requiredPermission) < 0) {
            // Forbidden
            ctx.status = 403;
            return;
        }

        // Bearer of token has permission to perform the action on the resource.
        routeHandler(ctx);
    }
}