import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

import {getTestComponents} from "../lib/config";
import {UserResource} from "../lib/resources/user-resource";
import * as routingMiddleware from "../lib/middleware/routing-middleware";
import {AppLauncher} from "../lib/app-launcher";
import {Log} from "../lib/shared/log";


let components = getTestComponents();
components.appSettings.suppressAuthorization = true;

components.middleware.authorizationChecker = null;
components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routingMiddleware.getUserRouteGenerator(components.userResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

describe("Simple user API", function () {
    let test_user = { name: "Pete", city: "Welly" };

    let beforeEach = done => {
        components.userDataAccess.clearUsers();
        done();
    }

    let afterEach = done => {
        components.userDataAccess.clearUsers();
        done();
    }

    it ("lists all users", done => {
        components.userDataAccess.addUser(test_user);
        components.userDataAccess.addUser(test_user);

        request
            .get("/user")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/Pete/)
            .expect(/Welly/)
            .expect(200, done);
    });

    it ("retrieves a user", done => {
        let insertedUser = components.userDataAccess.addUser(test_user);

        request
            .get(`/user/${insertedUser._id}`)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/Pete/)
            .expect(/Welly/)
            .expect(200, done);
    });

    it ("creates a new user", done => {
        request
            .post("/user")
            .send(test_user)
            .expect("location", /^\/user\/\d+$/) // /^\/user\/[0-9a-fA-F]{24}$/
            .expect(201, done);
    });

    it ("updates an existing user", done => {
        let userToUpdate = components.userDataAccess.addUser(test_user);
        let url = `/user/${userToUpdate._id}`;
        request
            .put(url)
            .send({ name: "Pete2", city: "Wellington" })
            .expect("location", url)
            .expect(/Pete2/)
            .expect(/Wellington/)
            .expect(200, done);
    });

    it ("deletes an existing user", done => {
        let userToDelete = components.userDataAccess.addUser(test_user);
        let url = `/user/${userToDelete._id}`;
        request
            .delete(url)
            .expect(200, done);
    });
});