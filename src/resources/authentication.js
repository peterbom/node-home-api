import {validateIdToken} from "../oidc/id-token-validator";
import {authProviderManager} from "../app";

export async function getProviders(ctx) {
    let providers = await Promise.all(authProviderManager.names.map(async function (name) {
        let settings = authProviderManager.getSettings(name);
        let metadataService = authProviderManager.getMetadataService(name);

        return {
            name: name,
            clientId: settings.client_id,
            authority: settings.authority,
            issuer: await metadataService.getIssuer(),
            authorizationEndpoint: await metadataService.getAuthorizationEndpoint()
        }
    }));

    ctx.body = {};
    for (let provider of providers) {
        ctx.body[provider.name] = provider;
    }
}

export async function authenticate(ctx) {
    let body = ctx.request.body;
    let idToken = body.id_token || body["#id_token"];

    try {
        await validateIdToken(idToken);
        ctx.status = 200;
    } catch (err) {
        console.trace(err);
        ctx.status = 400;
    }
}