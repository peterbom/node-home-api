import "babel-polyfill";
import {app} from "../lib/app";
import {addUser, clearUsers} from "../lib/userRoutes";
import supertest from "supertest";

let request = supertest.agent(app.listen());

/*
describe("Simple photo API", function () {
	it ("Gets all photos in a folder", function (done) {
		request
			.get("staging-photo")
			.send("folder_name")
			.expect(200, done);
	});
});
*/

describe("Simple user API", function () {
	let test_user = { name: "Pete", city: "Welly" };

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
});
