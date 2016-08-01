import "babel-polyfill";
import {app, authProviderManager} from "../lib/app";
import {Log} from "../lib/shared/log";
import supertest from "supertest";
import timekeeper from "timekeeper";

Log.logger = console;
Log.level = Log.INFO;

let request = supertest.agent(app.listen());

describe("Authentication API", function () {

    before(async function (done) {
        this.timeout(10000);
        await authProviderManager.retrieveAllMetadata();
        done();
    });

    it ("Validates an Outlook id_token", done => {
        let exampleTokenBody = {
            "#id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE16YWtpaGlSbGFfOHoyQkVKVlhlV01xbyJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJhdWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwNEMxNjc0NUQiLCJleHAiOjE0Njk4NTE1MzUsImlhdCI6MTQ2OTc2NTEzNSwibm9uY2UiOiI1MzI4ODA3NDY0MzcxNjQyNSIsIm5hbWUiOiJQZXRlIEJvbWJlciIsInByZWZlcnJlZF91c2VybmFtZSI6InBldGVfYm9tYmVyQGhvdG1haWwuY29tIiwiZW1haWwiOiJwZXRlX2JvbWJlckBob3RtYWlsLmNvbSIsInN1YiI6IjU1MjIyNjE2YWUyNjZmYWQ0ODAyOGY5NDY2ZWY2NWVlIiwidGlkIjoiOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIn0.lbVCCZzhs63w9RPvgcfao1z-hIsYqSWgOm0-zhx3uxm1GcwL-WLIFYPjb0bQaCbRP8uWhojEvYhHl_gV2miIA8SCDAupcUmAOcOMekYrEMKHkGBwu5nYUbb6S29Ri3KN1__uagEK2hS5YnPwLVsV8rUmUv5jsVs2oGgPNGSBnahTTjxdDN6tWyDQL3-zpBDtPaDB5taext6KNhlHLBhBD0340Tq9mS1wnUu-6RPQYdlMh1jv7Tvk_8ITAX3FNSZ7D_9O8GVNjRCAOzKlCPDFGfpccankkr0l-jaw0KQYV-IgEaAqRlZNQNr_2vZncCUAjKFoAtpuJ97-3pEysmvFBQ",
            state: "0.7163570182141372"
        };

        // Expiry time of token
        let time = new Date(1469851535000);
        timekeeper.freeze(time);

        request
            .post("/authentication")
            .send(exampleTokenBody)
            .expect(200)
            .end((err, result) => {
                timekeeper.reset();
                done();
            });
    });
})
