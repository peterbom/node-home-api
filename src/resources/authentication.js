import {sign as signJwt} from "jsonwebtoken";

import {parseJwt} from "../oidc/jose-util";
import {validateIdToken} from "../oidc/id-token-validator";
import {authProviderManager} from "../app";
import {getPermissions} from "../authorization/permission-manager";

export async function getProviders(ctx) {
    let providers = await Promise.all(authProviderManager.names.map(async function (name) {
        let settings = authProviderManager.getSettings(name);
        let metadataService = authProviderManager.getMetadataService(name);

        return {
            name: name,
            clientId: settings.client_id,
            authority: settings.authority,
            issuer: await metadataService.getIssuer(),
            authorizationEndpoint: await metadataService.getAuthorizationEndpoint(),
            popupWidth: settings.popupWidth,
            popupHeight: settings.popupHeight
        }
    }));

    ctx.body = {};
    for (let provider of providers) {
        ctx.body[provider.name] = provider;
    }
}

export async function authenticate(ctx) {
    let body = ctx.request.body;
    let idToken = body.id_token;

    try {
        await validateIdToken(idToken);
    } catch (err) {
        console.trace(err);
        ctx.status = 400;
        return;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("A secret must be configured to sign an access token");
    }

    let jwt = parseJwt(idToken);
    let user = {
        email: jwt.payload.email,
        name: jwt.payload.name,
        permissions: getPermissions(jwt.payload.email)
    };

    let token = signJwt(user, process.env.JWT_SECRET, {
        expiresIn : 60*60*24 // 24 hours
    });

    ctx.body = {
        access_token: token
    }

    ctx.status = 200;
}