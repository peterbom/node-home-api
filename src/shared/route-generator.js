import router from "koa-simple-router";
import {getSecureRouteHandler} from "../middleware/authorization-middleware";

export class RouteGenerator {

    securityResourceName;

    constructor(securityResourceName) {
        this.securityResourceName = securityResourceName;

        this._routeDescriptors = [];

        ["get", "post", "put", "delete"].forEach(method => {
            this[method] = (route, handler, securityActionName) => {
                let routeDescriptor = {
                    method: method,
                    route: route,
                    bareHandler: handler,
                    secureHandler: getSecureRouteHandler(handler, this.securityResourceName, securityActionName),
                    securityActionName: securityActionName
                };

                this._routeDescriptors.push(routeDescriptor);
                return this;
            }
        });
    }

    static create(securityResourceName) {
        return new RouteGenerator(securityResourceName);
    }

    toMiddleware(suppressAuthorization) {
        return router(_ => {
            this._routeDescriptors.forEach(r => _[r.method](
                r.route,
                suppressAuthorization ? r.bareHandler : r.secureHandler));
        });
    }
}