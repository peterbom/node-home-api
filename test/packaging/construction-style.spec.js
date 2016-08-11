import "babel-polyfill";

import supertest from "supertest";

import {MockDatabase} from "../mocks/mock-database";

import {getUnitTestSettings} from "../../lib/config";
import {initialize, app} from "../../lib/globals";

let settings = getUnitTestSettings();
settings.middleware.requireBearerToken = false;
settings.databaseFactory = () => new MockDatabase({
    "select * from ConstructionStyles": [
        {Name: "RSC/ฝาชน (flaps meet half way)"},
        {Name: "RSC/ฝาเกย (flaps overlap completely)"},
        {Name: "RSC/ฝาห่าง (top flaps don't meet, flap size specified by 'h')"},
        {Name: "RSC/ฝาครอบ (lidless)"}
    ]
});

describe("Construction style API", function () {

    it ("lists all construction styles", done => {

        initialize(settings);
        let request = supertest.agent(app.listen());

        request
            .get("/packaging/construction-style")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/ฝาชน/)
            .expect(/ฝาเกย/)
            .expect(/ฝาห่าง/)
            .expect(/ฝาครอบ/)
            .expect(res => {
                if (!res.length) {
                    return "No results found";
                }
            })
            .expect(200, done);
    });
});
