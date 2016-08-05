import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

import {getUnitTestSettings} from "../lib/config";
import {initialize, app} from "../lib/globals";
import {Log} from "../lib/shared/log";

let settings = getUnitTestSettings();
initialize(settings);

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
