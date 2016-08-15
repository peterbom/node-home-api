import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

import {getTestComponents} from "../lib/config";
import {AppLauncher} from "../lib/app-launcher";
import {Log} from "../lib/shared/log";

let components = getTestComponents();

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

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
