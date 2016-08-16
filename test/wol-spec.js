import "babel-polyfill";

import supertest from "supertest";

import {getTestComponents} from "../lib/config";
import * as routingMiddleware from "../lib/middleware/routing-middleware";
import {AppLauncher} from "../lib/app-launcher";


let components = getTestComponents();
components.appSettings.suppressAuthorization = true;

components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routingMiddleware.getWolRouteGenerator(components.wolResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

describe("WOL API", function () {
    it ("sends a WOL packet without error", done => {
        request
            .put("/wol/dev")
            .expect(200, done);
    });
})