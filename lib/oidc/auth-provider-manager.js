"use strict";

exports.__esModule = true;
exports.AuthProviderManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// TODO: Logging


var _oidcClientSettings = require("./oidc-client-settings");

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthProviderManager = exports.AuthProviderManager = function () {
    function AuthProviderManager(authSettings, jsonService) {
        _classCallCheck(this, AuthProviderManager);

        if (authSettings === undefined) {
            throw new Error("authSettings not defined");
        }

        if (jsonService === undefined) {
            throw new Error("jsonService not defined");
        }

        this._names = [];
        this._oidcClientSettingsLookup = {};

        for (var name in authSettings) {
            this._names.push(name);
            this._oidcClientSettingsLookup[name] = new _oidcClientSettings.OidcClientSettings(authSettings[name], jsonService);
        }
    }

    AuthProviderManager.prototype.getSettings = function getSettings(name) {
        return this._oidcClientSettingsLookup[name];
    };

    AuthProviderManager.prototype.getMetadataService = function getMetadataService(name) {
        return this._oidcClientSettingsLookup[name].metadataService;
    };

    AuthProviderManager.prototype.retrieveAllMetadata = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var _this = this;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return Promise.all(this.names.map(function (name) {
                                return _this.getMetadataService(name).getMetadata();
                            }));

                        case 2:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function retrieveAllMetadata() {
            return _ref.apply(this, arguments);
        }

        return retrieveAllMetadata;
    }();

    _createClass(AuthProviderManager, [{
        key: "names",
        get: function get() {
            return this._names;
        }
    }]);

    return AuthProviderManager;
}();