import "babel-polyfill";

import {Log} from "../lib/shared/log";
import supertest from "supertest";

import {getDefaultComponents} from "../lib/config";
import * as routing from "../lib/app-routing";
import {AppLauncher} from "../lib/app-launcher";


let components = getDefaultComponents();
components.appSettings.suppressAuthorization = true;

components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routing.getMachineStatusRouteGenerator(null, components.machineStatusResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

describe("Machine status API", function () {
    it ("sends a WOL packet without error", done => {
        request
            .put("/machine-status/dev")
            .send({ status: "online" })
            .expect(200, done);
    });
});