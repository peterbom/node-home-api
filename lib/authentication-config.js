"use strict";

exports.__esModule = true;
exports.createAuthProviderManager = createAuthProviderManager;

var _authProviderManager = require("./oidc/auth-provider-manager");

var outlookSettings = {
	name: "outlook",
	authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
	client_id: "00000000-0000-0000-0000-00004C16745D"
};

var googleSettings = {
	name: "google",
	authority: "https://accounts.google.com",
	client_id: "1062215298697-jkb62vvju15fip57ntra61i7jg9it4t8.apps.googleusercontent.com"
};

function createAuthProviderManager() {
	return new _authProviderManager.AuthProviderManager(outlookSettings, googleSettings);
}