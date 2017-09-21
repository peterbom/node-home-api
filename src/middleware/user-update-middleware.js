const Log = require("../shared/log").Log;

exports.userUpdater = async (ctx, next) => {
    let userDataAccess = ctx.components.userDataAccess;
    if (!userDataAccess) {
        throw new Error("userDataAccess not supplied");
    }

    let jsonService = ctx.components.jsonService;
    if (!jsonService) {
        throw new Error("jsonService not supplied");
    }

    let authServer = ctx.settings.authServer;
    if (!authServer) {
        throw new Error("authServer not supplied");
    }

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

        ctx.request.user = user;
    }

    await next();
}