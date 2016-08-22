import "babel-polyfill";

import {JwtUtils} from "../lib/shared/jwt-utils";
import timekeeper from "timekeeper";

describe("JwtUtils", function () {
    it ("can verify a real Auth0 id_token", async function (done) {
        let time = new Date(1471848758000);
        timekeeper.freeze(time);

        let jwtUtils = new JwtUtils("xeC1jNSaC4XI1DIN3OPF_Eb9UGYUNrrJrpNtROHC9XMWeriOyDMJ1TmSntqmwPQY");
        let token = await jwtUtils.verifyJwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JvbWIuYXUuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA2MDYxNTYzNTczNDUyMzk1NDMwIiwiYXVkIjoiSXJmSmd0azFybHFiSFg3eXdiVnNvZko3TU9zTno1MnMiLCJleHAiOjE0NzE4ODQ3NTgsImlhdCI6MTQ3MTg0ODc1OH0.2X7SRKXhKQZyYy0r1T_84PlFRzCVyJyhNTSKASV_RXE");

        if (!token) {
            return "Not verified";
        }

        done();
    });
})