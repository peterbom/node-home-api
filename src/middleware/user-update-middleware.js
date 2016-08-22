
export function getUserUpdater(userDataAccess, jsonService, authServer) {
    if (!userDataAccess) {
        throw new Error("userDataAccess not supplied");
    }

    if (!jsonService) {
        throw new Error("jsonService not supplied");
    }

    if (!authServer) {
        throw new Error("authServer not supplied");
    }

    return async function (ctx, next) {

        let jwt = ctx.request.bearerTokenJwt;
        let idToken = ctx.request.idToken;

        if (jwt && idToken && idToken.sub) {
            let user = await userDataAccess.findUser(idToken.sub);
            if (!user) {
                user = await jsonService.postJson(`https://${authServer}/tokeninfo`, {
                    id_token: jwt
                });

                Object.assign(user, {sub: idToken.sub});

                await userDataAccess.upsertUser(user);
            }
        }

        await next();
    }
}
