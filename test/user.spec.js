import "babel-polyfill";

import supertest from "supertest";

import {getDefaultComponents} from "../lib/config";
import * as routingMiddleware from "../lib/middleware/routing-middleware";
import {AppLauncher} from "../lib/app-launcher";


let components = getDefaultComponents();
components.appSettings.suppressAuthorization = true;

components.middleware.authorizationChecker = null;
components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routingMiddleware.getUserRouteGenerator(null, components.userResource)
];

AppLauncher.launch(components);

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