import "babel-polyfill";
import {app, authProviderManager} from "../lib/app";
import {Log} from "../lib/shared/log";
import supertest from "supertest";
import timekeeper from "timekeeper";

Log.logger = console;
Log.level = Log.WARN;

let request = supertest.agent(app.listen());

describe("Authentication API", function () {

    before(async function (done) {
        this.timeout(10000);
        await authProviderManager.retrieveAllMetadata();
        done();
    });

    it ("validates an Outlook id_token", done => {
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

    it ("validates a Google id_token", done => {
        let exampleTokenBody = {
            "#state": "0.8971197395172836",
            id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxOTJhNmIwNjE2ODUzMjE3MzJjNGJhMTBjMDEwOTY5YWUyZjU1YmMifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdWQiOiIxMDYyMjE1Mjk4Njk3LWprYjYydnZqdTE1ZmlwNTdudHJhNjFpN2pnOWl0NHQ4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MDYxNTYzNTczNDUyMzk1NDMwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjEwNjIyMTUyOTg2OTctamtiNjJ2dmp1MTVmaXA1N250cmE2MWk3amc5aXQ0dDguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6IjEwMzIwMTcxMzUzNzk5NTk2IiwiZW1haWwiOiJwZXRlYm9tYmVyQGdtYWlsLmNvbSIsImlhdCI6MTQ3MDAxNjU5MiwiZXhwIjoxNDcwMDIwMTkyLCJuYW1lIjoiUGV0ZSBCb21iZXIiLCJnaXZlbl9uYW1lIjoiUGV0ZSIsImZhbWlseV9uYW1lIjoiQm9tYmVyIiwibG9jYWxlIjoiZW4ifQ.Hz48MXKoKtDD1At4R2qekw-vgmstBuUhwE8Qe8MAWlkv6TTjS4qNq5KAqj5VCEbI2uc3-60UcaAt8IW7SglOOW_4w9RarXZwXpznnEUMml_U0G6ahASDD2q1wzlNjkVIWgb2JArVAyDxrvUxrcarWYjmaa5D6iKFhanEa6YRzYbX9Lt9pfJMEv0W7_JUfSqcIGzK6aPHasHeXa6tAMKunUBeddml80HCUhOmK25qH-yzt3b1DVXdZ-XY49fif4Q4Z3ckpUuL_HKtTPo-gNYsvuiGQKggphc_3iGlzvmeLoWiKHtaZvY_KBuYajBSj9ABVpUZCd5HnmZadb-yHY7ZnA",
            authuser: "0",
            prompt: "consent",
            session_state: "ba4895f1444b5865412dc5c582998a1f467cbaaa..e45e"
        }

        let time = new Date(1470020192000);
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

    it ("returns all providers", done => {
        request
            .get("/authentication")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(/outlook/)
            .expect(/google/)
            .expect(200, done);
    });
})
