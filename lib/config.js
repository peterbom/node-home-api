"use strict";

exports.__esModule = true;
var defaultSettings = {
    middleware: {
        errorHandler: true,
        corsConfig: true,
        bodyParser: true,
        bearerTokenParser: true,
        unsecuredRoutes: true,
        securedRoutes: true
    },
    port: process.env.PORT,
    authSettings: {
        "outlook": {
            authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0",
            client_id: "00000000-0000-0000-0000-00004C16745D"
        },
        "google": {
            authority: "https://accounts.google.com",
            client_id: "12212475530-pr5ug20eogvcicaggqk2bu0cr6bggspj.apps.googleusercontent.com"
        }
    },
    isUnitTest: false,
    allowHttpRequests: true,
    jsonServiceFactory: null
};

var getDefaultSettings = exports.getDefaultSettings = function getDefaultSettings() {
    return Object.assign({}, defaultSettings);
};

var getUnitTestSettings = exports.getUnitTestSettings = function getUnitTestSettings() {
    return Object.assign({}, defaultSettings, {
        isUnitTest: true,
        allowHttpRequests: false
    });
};