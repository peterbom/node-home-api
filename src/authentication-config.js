import {AuthProviderManager} from "./oidc/auth-provider-manager";

let outlookSettings = {
    name: "outlook",
    authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
    client_id: "00000000-0000-0000-0000-00004C16745D",
    popupWidth: 500,
    popupHeight: 560
};

let googleSettings = {
    name: "google",
    authority: "https://accounts.google.com",
    client_id: "12212475530-pr5ug20eogvcicaggqk2bu0cr6bggspj.apps.googleusercontent.com",
    popupWidth: 452,
    popupHeight: 633
}

export function createAuthProviderManager() {
    return new AuthProviderManager(outlookSettings, googleSettings);
}
