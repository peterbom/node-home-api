import "babel-polyfill";

import supertest from "supertest";

import {getTestComponents} from "../../lib/config";
import {ConstructionStyleResource} from "../../lib/resources/packaging/construction-style-resource";
import * as routingMiddleware from "../../lib/middleware/routing-middleware";
import {AppLauncher} from "../../lib/app-launcher";


let mockDataAccess = {
    getAll: async () => [{id: 1, name: "Style1"}, {id: 2, name: "Style2"}],
    getDetail: async (id) => ({
        id: 1,
        name: "Style1",
        variables: [
            {variableIndex: 1}
        ]
    })
};

let components = getTestComponents();
components.appSettings.suppressAuthorization = true;

components.packagingConstructionStyleDataAccess = mockDataAccess;
components.packagingConstructionStyleResource = new ConstructionStyleResource(
    components.packagingConstructionStyleDataAccess);

components.middleware.unsecuredRouteGenerators = [];
components.middleware.securedRouteGenerators = [
    routingMiddleware.getPackagingConstructionStyleRouteGenerator(components.packagingConstructionStyleResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());


describe("Construction style API", function () {

    it ("lists all construction styles", done => {

        request
            .get("/packaging/construction-style")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/Style1/)
            .expect(/Style2/)
            .expect(res => {
                if (!res.length) {
                    return "No results found";
                }
            })
            .expect(200, done);
    });

    it ("retrieves a construction style", done => {

        request
            .get("/packaging/construction-style/1")
            .set("Accept", "application/json")
            //.expect("Content-Type", /json/)
            .expect(200, done);
    });
});
