"use strict";

exports.__esModule = true;
exports.getDefaultSettings = getDefaultSettings;
exports.getUnitTestSettings = getUnitTestSettings;
function getDefaultSettings() {
    return {
        middleware: {
            errorHandler: true,
            corsConfig: true,
            bodyParser: true,
            requireBearerToken: true,
            unsecuredRoutes: true,
            securedRoutes: true
        },
        port: process.env.PORT,
        packagingConnectionString: "Driver={SQL Server Native Client 11.0};Server=tcp:bombers.database.windows.net,1433;Database=Packaging;Uid=petebomber@bombers;Pwd=" + process.env.PACKAGING_LOGIN_PASSWORD + ";Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;",
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
        jsonServiceFactory: null,
        databaseFactory: null
    };
}

function getUnitTestSettings() {
    return Object.assign(getDefaultSettings(), {
        isUnitTest: true,
        allowHttpRequests: false
    });
}