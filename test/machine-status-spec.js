const Log = require("../src/shared/log").Log;
const supertest = require("supertest");

const getDefaultComponents = require("../src/config").getDefaultComponents;
const routing = require("../src/app-routing");
const AppLauncher = require("../src/app-launcher").AppLauncher;


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