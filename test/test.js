import "babel-polyfill";
import {app} from "../src/app";

//var app = require("../src/app.js");
var request = require("supertest").agent(app.listen());

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
/*
describe("Creates a new user", function (done) {
	request
		.post("/user")
		.send(test_user)
		.expect("location", /^\/user\/[0-9a-fA-F]{24}$/)
		.expect(200, done);
});
*/