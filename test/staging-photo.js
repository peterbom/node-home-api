import {app} from "../lib/app";
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
