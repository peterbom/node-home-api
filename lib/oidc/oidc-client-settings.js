"use strict";

exports.__esModule = true;
exports.OidcClientSettings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

var _metadataService = require("./metadata-service");

var _log = require("../shared/log");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OidcMetadataUrlPath = ".well-known/openid-configuration";

var DefaultResponseType = "id_token";
var DefaultScope = "openid";
var DefaultStaleStateAge = 60; // seconds
var DefaultClockSkewInSeconds = 60 * 5;

var OidcClientSettings = exports.OidcClientSettings = function () {
    function OidcClientSettings() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var authority = _ref.authority;
        var metadataUrl = _ref.metadataUrl;
        var metadata = _ref.metadata;
        var signingKeys = _ref.signingKeys;
        var client_id = _ref.client_id;
        var _ref$response_type = _ref.response_type;
        var response_type = _ref$response_type === undefined ? DefaultResponseType : _ref$response_type;
        var _ref$scope = _ref.scope;
        var scope = _ref$scope === undefined ? DefaultScope : _ref$scope;
        var redirect_uri = _ref.redirect_uri;
        var post_logout_redirect_uri = _ref.post_logout_redirect_uri;
        var prompt = _ref.prompt;
        var display = _ref.display;
        var max_age = _ref.max_age;
        var ui_locales = _ref.ui_locales;
        var acr_values = _ref.acr_values;
        var _ref$filterProtocolCl = _ref.filterProtocolClaims;
        var filterProtocolClaims = _ref$filterProtocolCl === undefined ? true : _ref$filterProtocolCl;
        var _ref$loadUserInfo = _ref.loadUserInfo;
        var loadUserInfo = _ref$loadUserInfo === undefined ? true : _ref$loadUserInfo;
        var _ref$staleStateAge = _ref.staleStateAge;
        var staleStateAge = _ref$staleStateAge === undefined ? DefaultStaleStateAge : _ref$staleStateAge;
        var _ref$clockSkew = _ref.clockSkew;
        var clockSkew = _ref$clockSkew === undefined ? DefaultClockSkewInSeconds : _ref$clockSkew;
        var jsonService = arguments[1];

        _classCallCheck(this, OidcClientSettings);

        if (jsonService === undefined) {
            throw new Error("jsonService not defined");
        }

        this._authority = authority;
        this._metadataUrl = metadataUrl;
        this._metadata = metadata;
        this._signingKeys = signingKeys;

        this._client_id = client_id;
        this._response_type = response_type;
        this._scope = scope;
        this._redirect_uri = redirect_uri;
        this._post_logout_redirect_uri = post_logout_redirect_uri;

        this._prompt = prompt;
        this._display = display;
        this._max_age = max_age;
        this._ui_locales = ui_locales;
        this._acr_values = acr_values;

        this._filterProtocolClaims = !!filterProtocolClaims;
        this._loadUserInfo = !!loadUserInfo;
        this._staleStateAge = staleStateAge;
        this._clockSkew = clockSkew;

        this._metadataService = new _metadataService.MetadataService(this, jsonService);
    }

    // client config


    _createClass(OidcClientSettings, [{
        key: "client_id",
        get: function get() {
            return this._client_id;
        },
        set: function set(value) {
            if (!this._client_id) {
                // one-time set only
                this._client_id = value;
            } else {
                _log.Log.error("client_id has already been assigned.");
                throw new Error("client_id has already been assigned.");
            }
        }
    }, {
        key: "response_type",
        get: function get() {
            return this._response_type;
        }
    }, {
        key: "scope",
        get: function get() {
            return this._scope;
        }
    }, {
        key: "redirect_uri",
        get: function get() {
            return this._redirect_uri;
        }
    }, {
        key: "post_logout_redirect_uri",
        get: function get() {
            return this._post_logout_redirect_uri;
        }

        // optional protocol params

    }, {
        key: "prompt",
        get: function get() {
            return this._prompt;
        }
    }, {
        key: "display",
        get: function get() {
            return this._display;
        }
    }, {
        key: "max_age",
        get: function get() {
            return this._max_age;
        }
    }, {
        key: "ui_locales",
        get: function get() {
            return this._ui_locales;
        }
    }, {
        key: "acr_values",
        get: function get() {
            return this._acr_values;
        }

        // metadata

    }, {
        key: "authority",
        get: function get() {
            return this._authority;
        },
        set: function set(value) {
            if (!this._authority) {
                // one-time set only
                this._authority = value;
            } else {
                _log.Log.error("authority has already been assigned.");
                throw new Error("authority has already been assigned.");
            }
        }
    }, {
        key: "metadataUrl",
        get: function get() {
            if (!this._metadataUrl) {
                this._metadataUrl = this.authority;

                if (this._metadataUrl && this._metadataUrl.indexOf(OidcMetadataUrlPath) < 0) {
                    if (this._metadataUrl[this._metadataUrl.length - 1] !== '/') {
                        this._metadataUrl += '/';
                    }
                    this._metadataUrl += OidcMetadataUrlPath;
                }
            }

            return this._metadataUrl;
        }

        // settable/cachable metadata values

    }, {
        key: "metadata",
        get: function get() {
            return this._metadata;
        },
        set: function set(value) {
            this._metadata = value;
        }
    }, {
        key: "signingKeys",
        get: function get() {
            return this._signingKeys;
        },
        set: function set(value) {
            this._signingKeys = value;
        }

        // behavior flags

    }, {
        key: "filterProtocolClaims",
        get: function get() {
            return this._filterProtocolClaims;
        }
    }, {
        key: "loadUserInfo",
        get: function get() {
            return this._loadUserInfo;
        }
    }, {
        key: "staleStateAge",
        get: function get() {
            return this._staleStateAge;
        }
    }, {
        key: "clockSkew",
        get: function get() {
            return this._clockSkew;
        }
    }, {
        key: "metadataService",
        get: function get() {
            return this._metadataService;
        }
    }]);

    return OidcClientSettings;
}();