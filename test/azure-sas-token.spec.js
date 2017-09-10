const {Log} = require("../src/shared/log");
const supertest = require("supertest");

const {MockPermissionDataAccess} = require("./mocks/mock-permission-data-access");
const createIdToken = require("./utils/token-utils").createIdToken;

const getDefaultComponents = require("../src/config").getDefaultComponents;
const AppLauncher = require("../src/app-launcher").AppLauncher;
const RouteGenerator = require("../src/shared/route-generator").RouteGenerator;
const getTestEnvVars = require("./utils/env-utils").getTestEnvVars;

let envVars = getTestEnvVars();
let settings = {
    connectionString: "mongodb://fakeuser:fakepassword@fakedomain.com/fakedb",
    blobStorageConnectionString: envVars["TEST_BLOB_STORAGE_CONNECTION_STRING"],
    jobStorageConnectionString: envVars["TEST_JOB_STORAGE_CONNECTION_STRING"],
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

describe("Azure SAS token resource", function () {
    it ("generates SAS token", done => {
        let components = getDefaultComponents(settings);
        components.permissionDataAccess = new MockPermissionDataAccess({"user_1": ["home_manage"]});
        components.middleware.userUpdater = null;

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

        let token = createIdToken(components.jwtUtils, "user_1");

        request
            .get("/azure-sas-token")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(res =>
                typeof res.body.token === "string" &&
                typeof res.body.uri === "string")
            .expect(200, done);
    });
});