const Log = require("../../src/shared/log").Log;
const timekeeper = require("timekeeper");

exports.createIdToken = (jwtUtils, sub, time, lifetimeInMinutes) => {

    let user = {
        sub: sub,
        "iss": "https://authdomain.com",
        "aud": "aaaaaaaaaaaaaaa"
    };

    timekeeper.freeze(time || new Date());

    return jwtUtils.signJwt(user, lifetimeInMinutes || 1);

    timekeeper.reset();
}