const Log = require("../src/shared/log").Log;
const supertest = require("supertest");

const getDefaultComponents = require("../src/config").getDefaultComponents;
const routing = require("../src/app-routing");
const AppLauncher = require("../src/app-launcher").AppLauncher;
const {MockUserDataAccess} = require("./mocks/mock-user-data-access");
const {UserResource} = require("../src/resources/user-resource");

let settings = {
    connectionString: "mongodb://fakeuser:fakepassword@fakedomain.com/fakedb",
    authServer: "test.auth.com",
    authJwksUrl: "https://test.auth.com/.well-known/jwks.json",
    authAudience: "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA",
    authIssuer: "https://test.auth.com/",
    machineLookup: {
        test: {
            macAddress: "11:11:11:11:11:11"
        },
        flash: {
            ipAddress: "127.0.0.1"
        }
    },
    suppressAuthorization: true
};

let components = getDefaultComponents(settings);
components.userDataAccess = new MockUserDataAccess();
components.userResource = new UserResource(components.userDataAccess);

components.middleware.authorizationChecker = null;
components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [routing.userRouteGenerator];

AppLauncher.launch(settings, components);

let request = supertest.agent(components.app.listen());

describe("User API", function () {

    it ("lists all users", async function (done) {
        await components.userDataAccess.clearUsers();

        await components.userDataAccess.upsertUser({ sub: "a", name: "Pete", city: "Welly" });
        await components.userDataAccess.upsertUser({ sub: "b", name: "Bill", city: "Welly" });

        request
            .get("/user")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/Pete/)
            .expect(/Welly/)
            .expect(200, done);
    });

    it ("retrieves a user", async function (done) {
        await components.userDataAccess.clearUsers();
        let insertedUser = await components.userDataAccess.upsertUser({ sub: "a", name: "Pete", city: "Welly" });

        request
            .get(`/user/${insertedUser.sub}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/Pete/)
            .expect(/Welly/)
            .expect(200, done);
    });

    it ("creates a new user", async function (done) {
        await components.userDataAccess.clearUsers();
        request
            .post("/user")
            .send({ sub: "a", name: "Pete", city: "Welly" })
            .expect("location", /^\/user\/a/)
            .expect(201, done);
    });

    it ("updates an existing user", async function (done) {
        await components.userDataAccess.clearUsers();
        let userToUpdate = await components.userDataAccess.upsertUser({ sub: "a", name: "Pete", city: "Welly" });
        let url = `/user/${userToUpdate.sub}`;
        request
            .put(url)
            .send({ name: "Pete2", city: "Wellington" })
            .expect("location", url)
            .expect(/Pete2/)
            .expect(/Wellington/)
            .expect(200, done);
    });

    it ("deletes an existing user", async function (done) {
        await components.userDataAccess.clearUsers();
        let userToDelete = await components.userDataAccess.upsertUser({ sub: "a", name: "Pete", city: "Welly" });
        let url = `/user/${userToDelete.sub}`;
        request
            .delete(url)
            .expect(200, done);
    });
});