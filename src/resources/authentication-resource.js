
export class AuthenticationResource {

    constructor (authProviderManager, idTokenValidator, jwtParser, permissionManager, jwtSigner) {
        if (authProviderManager === undefined) {
            throw new Error("authProviderManager not defined");
        }

        if (idTokenValidator === undefined) {
            throw new Error("idTokenValidator not defined");
        }

        if (jwtParser === undefined) {
            throw new Error("jwtParser not defined");
        }

        if (permissionManager === undefined) {
            throw new Error("permissionManager not defined");
        }

        if (jwtSigner === undefined) {
            throw new Error("jwtSigner not defined");
        }

        this._authProviderManager = authProviderManager;
        this._idTokenValidator = idTokenValidator;
        this._jwtParser = jwtParser;
        this._permissionManager = permissionManager;
        this._jwtSigner = jwtSigner;
    }

    async getProviders(ctx) {
        let manager = this._authProviderManager;
        let providers = await Promise.all(manager.names.map(async function (name) {
            let settings = manager.getSettings(name);
            let metadataService = manager.getMetadataService(name);

            return {
                name: name,
                clientId: settings.client_id,
                authority: settings.authority,
                issuer: await metadataService.getIssuer(),
                authorizationEndpoint: await metadataService.getAuthorizationEndpoint(),
                signingKeys: await metadataService.getSigningKeys()
            }
        }));

        ctx.body = {};
        for (let provider of providers) {
            ctx.body[provider.name] = provider;
        }
    }

    async authenticate(ctx) {
        let body = ctx.request.body;
        let providerName = body.provider;
        let idToken = body.id_token;

        try {
            await this._idTokenValidator.validateIdToken(providerName, idToken);
        } catch (err) {
            // TODO: Logging
            console.log("----- Invalid id_token received. Returning 400 (bad request) -----");
            console.trace(err);
            ctx.status = 400;
            return;
        }

        let jwt = this._jwtParser.parseJwt(idToken);
        let user = {
            email: jwt.payload.email,
            name: jwt.payload.name,
            permissions: this._permissionManager.getPermissions(jwt.payload.email)
        };

        let token = this._jwtSigner.signJwt(user, 60 * 24);

        ctx.body = {
            access_token: token
        }

        ctx.status = 200;
    }
}