const Log = require("../src/shared/log").Log;
const JwtUtils = require("../src/shared/jwt-utils").JwtUtils;
const MockJsonService = require("./mocks/mock-json-service").MockJsonService;
const {configureMockJsonService, createIdToken} = require("./utils/token-utils");
const timekeeper = require("timekeeper");

const JwksUrl = "https://test.auth.com/.well-known/jwks.json";
const Audience = "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA";
const Issuer = "https://test.auth.com/";

let mockJwksJsonService = new MockJsonService();
configureMockJsonService(mockJwksJsonService, JwksUrl);

describe("JwtUtils", function () {
    afterEach(() => timekeeper.reset());

    it ("can sign and verify an id_token", async function (done) {
        let jwtUtils = new JwtUtils(JwksUrl, Audience, Issuer);
        let jwt = createIdToken(jwtUtils, "user_1", 10);
        
        let decoded = await jwtUtils.verifyJwt(jwt, mockJwksJsonService);

        if (!decoded) {
            return "Not verified";
        }

        done();
    });
})