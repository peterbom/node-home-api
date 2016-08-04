import "babel-polyfill";
import {app} from "../lib/app";
import {addUser, clearUsers} from "../lib/data-access/user";
import supertest from "supertest";
import timekeeper from "timekeeper";

let request = supertest.agent(app.listen());

describe("Simple user API", function () {
    let test_user = { name: "Pete", city: "Welly" };

    // Token signed with "secret";
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQGVtYWlsLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJwZXJtaXNzaW9ucyI6WyJob21lX21hbmFnZSJdLCJpYXQiOjE0NzAyODg5NDIsImV4cCI6MTQ3MDI4OTAwMn0.2-5wq_1o7LQPxGV91vvYodkACrkrRWSYPNSbC_-hZd0";
    let authTime = new Date(1470288943000);

    let beforeEach = done => {
        clearUsers();
        done();
    }

    let afterEach = done => {
        clearUsers();
        done();
    }

    it ("retrieves a user", done => {
        let insertedUser = addUser(test_user);
        timekeeper.freeze(authTime);
        process.env.JWT_SECRET = "secret";

        request
            .get(`/user/${insertedUser._id}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(/Pete/)
            .expect(/Welly/)
            .expect(200, done);
    });

    it ("creates a new user", done => {
        timekeeper.freeze(authTime);
        process.env.JWT_SECRET = "secret";

        request
            .post("/user")
            .set("Authorization", `Bearer ${token}`)
            .send(test_user)
            .expect("location", /^\/user\/\d+$/) // /^\/user\/[0-9a-fA-F]{24}$/
            .expect(201, done);
    });

    it ("updates an existing user", done => {
        timekeeper.freeze(authTime);
        process.env.JWT_SECRET = "secret";

        let userToUpdate = addUser(test_user);
        let url = `/user/${userToUpdate._id}`;
        request
            .put(url)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Pete2", city: "Wellington" })
            .expect("location", url)
            .expect(/Pete2/)
            .expect(/Wellington/)
            .expect(200, done);
    });

    it ("deletes an existing user", done => {
        timekeeper.freeze(authTime);
        process.env.JWT_SECRET = "secret";

        let userToDelete = addUser(test_user);
        let url = `/user/${userToDelete._id}`;
        request
            .delete(url)
            .set("Authorization", `Bearer ${token}`)
            .expect(200, done);
    });
});
