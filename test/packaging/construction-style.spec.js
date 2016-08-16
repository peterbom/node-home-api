import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

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

function getMockedComponents() {
    let components = getTestComponents();

    components.packagingConstructionStyleDataAccess = mockDataAccess;
    components.packagingConstructionStyleResource = new ConstructionStyleResource(
        components.packagingConstructionStyleDataAccess);

    components.middleware.unsecuredRouteGenerators = [];
    components.middleware.securedRouteGenerators = [
        routingMiddleware.getPackagingConstructionStyleRouteGenerator(components.packagingConstructionStyleResource)
    ];

    return components;
}


describe("Construction style API", function () {

    it ("lists all construction styles without authorization", done => {

        let components = getMockedComponents();
        components.appSettings.suppressAuthorization = true;

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

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

    it ("retrieves a construction style without authorization", done => {

        let components = getMockedComponents();
        components.appSettings.suppressAuthorization = true;

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

        request
            .get("/packaging/construction-style/1")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it ("lists all construction styles when user has packaging_maintain permission", done => {

        let components = getMockedComponents();
        components.appSettings.suppressAuthorization = false;

        AppLauncher.launch(components);
        let request = supertest.agent(components.app.listen());

        let user = {
            email: "test@email.com",
            name: "Test User",
            permissions: ["packaging_maintain"]
        };

        let time = new Date(2016, 1, 1);
        timekeeper.freeze(time);

        let token = components.jwtSigner.signJwt(user, 1);
    
        request
            .get("/packaging/construction-style")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
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
});
