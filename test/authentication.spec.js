import "babel-polyfill";

import supertest from "supertest";
import timekeeper from "timekeeper";

import {MockJsonService} from "./mocks/mock-json-service";

import {getTestComponents} from "../lib/config";
import {AuthProviderManager} from "../lib/oidc/auth-provider-manager";
import {IdTokenValidator} from "../lib/oidc/id-token-validator";
import {AuthenticationResource} from "../lib/resources/authentication-resource";
import * as routingMiddleware from "../lib/middleware/routing-middleware";
import {AppLauncher} from "../lib/app-launcher";

import {Log} from "../lib/shared/log";

let mockJsonService = new MockJsonService({
    "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0/.well-known/openid-configuration": {
        "authorization_endpoint":"https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize",
        "token_endpoint":"https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
        "jwks_uri":"https://login.microsoftonline.com/consumers/discovery/v2.0/keys",
        "issuer":"https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0"
    },
    "https://login.microsoftonline.com/consumers/discovery/v2.0/keys": {
        "keys":[{
            "kty":"RSA",
            "use":"sig",
            "kid":"1LTMzakihiRla_8z2BEJVXeWMqo",
            "x5t":"1LTMzakihiRla_8z2BEJVXeWMqo",
            "n":"3sKcJSD4cHwTY5jYm5lNEzqk3wON1CaARO5EoWIQt5u-X-ZnW61CiRZpWpfhKwRYU153td5R8p-AJDWT-NcEJ0MHU3KiuIEPmbgJpS7qkyURuHRucDM2lO4L4XfIlvizQrlyJnJcd09uLErZEO9PcvKiDHoois2B4fGj7CsAe5UZgExJvACDlsQSku2JUyDmZUZP2_u_gCuqNJM5o0hW7FKRI3MFoYCsqSEmHnnumuJ2jF0RHDRWQpodhlAR6uKLoiWHqHO3aG7scxYMj5cMzkpe1Kq_Dm5yyHkMCSJ_JaRhwymFfV_SWkqd3n-WVZT0ADLEq0RNi9tqZ43noUnO_w",
            "e":"AQAB",
            "x5c":[
                "MIIDYDCCAkigAwIBAgIJAIB4jVVJ3BeuMA0GCSqGSIb3DQEBCwUAMCkxJzAlBgNVBAMTHkxpdmUgSUQgU1RTIFNpZ25pbmcgUHVibGljIEtleTAeFw0xNjA0MDUxNDQzMzVaFw0yMTA0MDQxNDQzMzVaMCkxJzAlBgNVBAMTHkxpdmUgSUQgU1RTIFNpZ25pbmcgUHVibGljIEtleTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN7CnCUg+HB8E2OY2JuZTRM6pN8DjdQmgETuRKFiELebvl/mZ1utQokWaVqX4SsEWFNed7XeUfKfgCQ1k/jXBCdDB1NyoriBD5m4CaUu6pMlEbh0bnAzNpTuC+F3yJb4s0K5ciZyXHdPbixK2RDvT3Lyogx6KIrNgeHxo+wrAHuVGYBMSbwAg5bEEpLtiVMg5mVGT9v7v4ArqjSTOaNIVuxSkSNzBaGArKkhJh557pridoxdERw0VkKaHYZQEerii6Ilh6hzt2hu7HMWDI+XDM5KXtSqvw5ucsh5DAkifyWkYcMphX1f0lpKnd5/llWU9AAyxKtETYvbameN56FJzv8CAwEAAaOBijCBhzAdBgNVHQ4EFgQU9IdLLpbC2S8Wn1MCXsdtFac9SRYwWQYDVR0jBFIwUIAU9IdLLpbC2S8Wn1MCXsdtFac9SRahLaQrMCkxJzAlBgNVBAMTHkxpdmUgSUQgU1RTIFNpZ25pbmcgUHVibGljIEtleYIJAIB4jVVJ3BeuMAsGA1UdDwQEAwIBxjANBgkqhkiG9w0BAQsFAAOCAQEAXk0sQAib0PGqvwELTlflQEKS++vqpWYPW/2gCVCn5shbyP1J7z1nT8kE/ZDVdl3LvGgTMfdDHaRF5ie5NjkTHmVOKbbHaWpTwUFbYAFBJGnx+s/9XSdmNmW9GlUjdpd6lCZxsI6888r0ptBgKINRRrkwMlq3jD1U0kv4JlsIhafUIOqGi4+hIDXBlY0F/HJPfUU75N885/r4CCxKhmfh3PBM35XOch/NGC67fLjqLN+TIWLoxnvil9m3jRjqOA9u50JUeDGZABIYIMcAdLpI2lcfru4wXcYXuQul22nAR7yOyGKNOKULoOTE4t4AeGRqCogXSxZgaTgKSBhvhE+MGg=="
            ],
            "issuer":"https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0"
        }]
    },
    "https://accounts.google.com/.well-known/openid-configuration": {
        "issuer": "https://accounts.google.com",
        "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
        "token_endpoint": "https://www.googleapis.com/oauth2/v4/token",
        "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs"
    },
    "https://www.googleapis.com/oauth2/v3/certs": {
        "keys": [{
            "kty": "RSA",
            "alg": "RS256",
            "use": "sig",
            "kid": "d0ec514a32b6f88c0abd12a2840699bdd3deba9d",
            "n": "yecH_BNaZW3vuU2jepfqUVeXrGzRKQo6CvAI4lqOFdfYjXtj7VAg64Q7-VtCO-VDovnXsQ2f_ytts3B3UI9j8v8nNDlrNSL7vwekgu-FNfsCDV8ktmNivES9ounsL1xbg5u6Amvyp4p8fQ_QJmp0GHaUy4m2BsU9dp-kpoO7ByKqbpbjHHiSvxyST5JZk1_PV9lzsmpm5pyXw28w-l6lVrdG9in82Kao4LciOspOMserCBguag0abrSE19vE5n_36ZStqUqR-IdOsGTq3BehJP7OmX21BcqSpRep4uo5Y61qZvFBcOXLyk0YGZ4x7ksvzFHzjpl6pi_Awv3-VWfC-w",
            "e": "AQAB"
        }]
    }
});

let authSettings = {
    "outlook": {
        authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
        client_id: "00000000-0000-0000-0000-00004C16745D"
    },
    "google": {
        authority: "https://accounts.google.com",
        client_id: "1062215298697-jkb62vvju15fip57ntra61i7jg9it4t8.apps.googleusercontent.com"
    }
};

let components = getTestComponents();

components.authProviderManager = new AuthProviderManager(authSettings, mockJsonService);

components.idTokenValidator = new IdTokenValidator(
    components.authProviderManager,
    components.jwtParser,
    components.jwtValidator);

components.authenticationResource = new AuthenticationResource(
    components.authProviderManager,
    components.idTokenValidator,
    components.jwtParser,
    components.permissionManager,
    components.jwtSigner);

components.middleware.unsecuredRoutes = [
    routingMiddleware.getAuthenticationRouter(components.authenticationResource)
];

AppLauncher.launch(components);

let request = supertest.agent(components.app.listen());

describe("Authentication API", function () {

    before(async function (done) {
        this.timeout(10000);
        await components.authProviderManager.retrieveAllMetadata();
        done();
    });

    it ("validates an Outlook id_token", done => {
        let exampleTokenBody = {
            provider: "outlook",
            id_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE16YWtpaGlSbGFfOHoyQkVKVlhlV01xbyJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJhdWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwNEMxNjc0NUQiLCJleHAiOjE0Njk4NTE1MzUsImlhdCI6MTQ2OTc2NTEzNSwibm9uY2UiOiI1MzI4ODA3NDY0MzcxNjQyNSIsIm5hbWUiOiJQZXRlIEJvbWJlciIsInByZWZlcnJlZF91c2VybmFtZSI6InBldGVfYm9tYmVyQGhvdG1haWwuY29tIiwiZW1haWwiOiJwZXRlX2JvbWJlckBob3RtYWlsLmNvbSIsInN1YiI6IjU1MjIyNjE2YWUyNjZmYWQ0ODAyOGY5NDY2ZWY2NWVlIiwidGlkIjoiOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIn0.lbVCCZzhs63w9RPvgcfao1z-hIsYqSWgOm0-zhx3uxm1GcwL-WLIFYPjb0bQaCbRP8uWhojEvYhHl_gV2miIA8SCDAupcUmAOcOMekYrEMKHkGBwu5nYUbb6S29Ri3KN1__uagEK2hS5YnPwLVsV8rUmUv5jsVs2oGgPNGSBnahTTjxdDN6tWyDQL3-zpBDtPaDB5taext6KNhlHLBhBD0340Tq9mS1wnUu-6RPQYdlMh1jv7Tvk_8ITAX3FNSZ7D_9O8GVNjRCAOzKlCPDFGfpccankkr0l-jaw0KQYV-IgEaAqRlZNQNr_2vZncCUAjKFoAtpuJ97-3pEysmvFBQ"
        };

        // Expiry time of token
        let time = new Date(1469851535000);
        timekeeper.freeze(time);

        request
            .post("/authentication")
            .send(exampleTokenBody)
            .expect(200)
            .expect(/access_token/)
            .end((err, result) => {
                timekeeper.reset();
                done(err);
            });
    });

    it ("validates a Google id_token", done => {
        let exampleTokenBody = {
            provider: "google",
            id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQwZWM1MTRhMzJiNmY4OGMwYWJkMTJhMjg0MDY5OWJkZDNkZWJhOWQifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiIxMDYyMjE1Mjk4Njk3LWprYjYydnZqdTE1ZmlwNTdudHJhNjFpN2pnOWl0NHQ4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MDYxNTYzNTczNDUyMzk1NDMwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEwNjIyMTUyOTg2OTctamtiNjJ2dmp1MTVmaXA1N250cmE2MWk3amc5aXQ0dDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Inh1YTJzMnk3aTBwNDI1NGtqZTN6bmNkaSIsImVtYWlsIjoicGV0ZWJvbWJlckBnbWFpbC5jb20iLCJpYXQiOjE0NzAyMTc3ODEsImV4cCI6MTQ3MDIyMTM4MSwibmFtZSI6IlBldGUgQm9tYmVyIiwiZ2l2ZW5fbmFtZSI6IlBldGUiLCJmYW1pbHlfbmFtZSI6IkJvbWJlciIsImxvY2FsZSI6ImVuIn0.pttuPx5CYuck52UHuOYmUqNqmWwIsDpkBIzreBV7y_xDDVfBCplzLitzJ5nCa4IX0THSqgUStumKxSgPjuujR3qBg0is0X_J6IltTq1MkiKuvbjin90Gv4AGVGTgD8IQTiIUo3nMPSU2inf6m22n70JCE1W9Lx3VXb8O2oRb3xBd6CBiz5vbDRglXs8LGip4UmtAowI9haUKR7kpM2yLQ7LPgmP3pZqfIbOctqhkChrgN5JsNAtJbd5nWNLqjcggNvHozjUWEm-4SsY4mX-JlVqStpDTEutRcSTdf67C31wYfofBdakKXsjwi-kMkcn21dIGgrbqXnWY9hbUcYfP2g"
        }

        let time = new Date(1470217781000);
        timekeeper.freeze(time);

        request
            .post("/authentication")
            .send(exampleTokenBody)
            .expect(200)
            .expect(/access_token/)
            .end((err, result) => {
                timekeeper.reset();
                done(err);
            });
    });

    it ("refuses to issue an access token for an invalid ID token", done => {
        let exampleTokenBody = {
            provider: "google",
            id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQwZWM1MTRhMzJiNmY4OGMwYWJkMTJhMjg0MDY5OWJkZDNkZWJhOWQifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiIxMDYyMjE1Mjk4Njk3LWprYjYydnZqdTE1ZmlwNTdudHJhNjFpN2pnOWl0NHQ4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MDYxNTYzNTczNDUyMzk1NDMwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEwNjIyMTUyOTg2OTctamtiNjJ2dmp1MTVmaXA1N250cmE2MWk3amc5aXQ0dDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Inh1YTJzMnk3aTBwNDI1NGtqZTN6bmNkaSIsImVtYWlsIjoicGV0ZWJvbWJlckBnbWFpbC5jb20iLCJpYXQiOjE0NzAyMTc3ODEsImV4cCI6MTQ3MDIyMTM4MSwibmFtZSI6IlBldGUgQm9tYmVyIiwiZ2l2ZW5fbmFtZSI6IlBldGUiLCJmYW1pbHlfbmFtZSI6IkJvbWJlciIsImxvY2FsZSI6ImVuIn0.pttuPx5CYuck52UHuOYmUqNqmWwIsDpkBIzreBV7y_xDDVfBCplzLitzJ5nCa4IX0THSqgUStumKxSgPjuujR3qBg0is0X_J6IltTq1MkiKuvbjin90Gv4AGVGTgD8IQTiIUo3nMPSU2inf6m22n70JCE1W9Lx3VXb8O2oRb3xBd6CBiz5vbDRglXs8LGip4UmtAowI9haUKR7kpM2yLQ7LPgmP3pZqfIbOctqhkChrgN5JsNAtJbd5nWNLqjcggNvHozjUWEm-4SsY4mX-JlVqStpDTEutRcSTdf67C31wYfofBdakKXsjwi-kMkcn21dIGgrbqXnWY9hbUcYfP2g"
        }

        let time = new Date(1470500000000);  // Token is expired
        timekeeper.freeze(time);

        request
            .post("/authentication")
            .send(exampleTokenBody)
            .expect(400)
            .end((err, result) => {
                timekeeper.reset();
                done(err);
            });
    });

    it ("returns all providers", done => {
        request
            .get("/authentication")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/outlook/)
            .expect(/google/)
            .expect(/issuer/)
            .expect(/authorizationEndpoint/)
            .expect(/signingKeys/)
            .expect(200, done);
    });
});
