import timekeeper from "timekeeper";

export function createIdToken(jwtUtils, sub, time, lifetimeInMinutes) {

    let user = {
        sub: sub,
        "iss": "https://bomb.au.auth0.com/",
        "aud": "IrfJgtk1rlqbHX7ywbVsofJ7MOsNz52s"
    };

    timekeeper.freeze(time || new Date(2016, 1, 1));

    return jwtUtils.signJwt(user, lifetimeInMinutes || 1);
}