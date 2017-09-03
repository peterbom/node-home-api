const Log = require("../src/shared/log").Log;
const supertest = require("supertest");

const getDefaultComponents = require("../src/config").getDefaultComponents;
const routing = require("../src/app-routing");
const AppLauncher = require("../src/app-launcher").AppLauncher;

let settings = {
    connectionString: "mongodb://fakeuser:fakepassword@fakedomain.com/fakedb",
    authServer: "test.auth.com",
    authProviderSecret: "secret",
    machineLookup: {
        test: {
            macAddress: "11:11:11:11:11:11"
        },
        flash: {
            ipAddress: "127.0.0.1"
        }
    },
};

let components = getDefaultComponents(settings);
components.appSettings.suppressAuthorization = true;

components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routing.getMachineStatusRouteGenerator(components.machineStatusResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

describe("Machine status API", function () {
    it ("sends a WOL packet without error", done => {
        request
            .put("/machine-status/test")
            .send({ status: "online" })
            .expect(200, done);
    });
});