import {AuthProviderManager} from "./oidc/auth-provider-manager";

var outlookSettings = {
    authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0", //"https://login.microsoftonline.com/common",
    client_id: "00000000-0000-0000-0000-00004C16745D", //"000000004C16745D",
    //redirect_uri: 'http://localhost:5000/oidc-client-sample.html',
    //post_logout_redirect_uri: 'http://localhost:5000/oidc-client-sample.html',
    //response_type: 'id_token token',
    //scope: 'openid email roles',

    //filterProtocolClaims: true,
    //loadUserInfo: true
};

export function createAuthProviderManager() {
	return new AuthProviderManager(outlookSettings);
}
