"use strict";

exports.__esModule = true;
exports.createAuthProviderManager = createAuthProviderManager;

var _authProviderManager = require("./oidc/auth-provider-manager");

var outlookSettings = {
    authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0", //"https://login.microsoftonline.com/common",
    client_id: "00000000-0000-0000-0000-00004C16745D" };

function createAuthProviderManager() {
    return new _authProviderManager.AuthProviderManager(outlookSettings);
}