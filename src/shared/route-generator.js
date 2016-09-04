import {Log} from "./log";
import router from "koa-simple-router";

function getSecureRouteHandler(permissionDataAccess, routeHandler, securityResourceName, securityActionName) {

    if (!securityResourceName && !securityActionName) {
        // No security checking needed.
        return routeHandler;
    }

    if (!securityResourceName) {
        throw new Error(`Resource is not secured but security action ${securityActionName} is specified`);
    }

    if (!securityActionName) {
        throw new Error(`Resource is secured with ${securityResourceName} but no security action name is specified`);
    }

    return async function (ctx) {
        let idToken = ctx.request.idToken;
        if (!idToken) {
            // This is an error because we shouldn't even reach this middleware without an access token.
            throw new Error(`Resource is secured by ${securityActionName} on ${securityResourceName} but no access token is provided`);
        }

        if (!idToken.sub) {
            throw new Error("no \"sub\" claim on access token");
        }

        let permissions = await permissionDataAccess.getPermissions(idToken.sub);

        let requiredPermission = `${securityResourceName}_${securityActionName}`;

        if (permissions.indexOf(requiredPermission) < 0) {
            // Forbidden
            ctx.status = 403;
            return;
        }

        // Bearer of token has permission to perform the action on the resource.
        await routeHandler(ctx);
    }
}

export class RouteGenerator {

    securityResourceName;

    constructor(permissionDataAccess, securityResourceName) {
        this.securityResourceName = securityResourceName;

        this._routeDescriptors = [];

        ["get", "post", "put", "delete"].forEach(method => {
            this[method] = (route, handler, securityActionName) => {
                let routeDescriptor = {
                    method: method,
                    route: route,
                    bareHandler: handler,
                    secureHandler: getSecureRouteHandler(permissionDataAccess, handler, this.securityResourceName, securityActionName),
                    securityActionName: securityActionName
                };

                this._routeDescriptors.push(routeDescriptor);
                return this;
            }
        });
    }

    static create(permissionDataAccess, securityResourceName) {
        return new RouteGenerator(permissionDataAccess, securityResourceName);
    }

    toMiddleware(suppressAuthorization) {
        return router(_ => {
            this._routeDescriptors.forEach(r => _[r.method](
                r.route,
                suppressAuthorization ? r.bareHandler : r.secureHandler));
        });
    }
}