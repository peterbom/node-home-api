"use strict";

exports.__esModule = true;
exports.AuthProviderManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var getMetadataServicesIndex = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(metadataServices, issuer) {
        var issuers;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _log.Log.info("Getting metadata services for issuer " + issuer);
                        _context4.next = 3;
                        return Promise.all(metadataServices.map(function (ms) {
                            return ms.getIssuer();
                        }));

                    case 3:
                        issuers = _context4.sent;
                        return _context4.abrupt("return", issuers.indexOf(issuer));

                    case 5:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function getMetadataServicesIndex(_x3, _x4) {
        return _ref4.apply(this, arguments);
    };
}();

var _oidcClientSettings = require("./oidc-client-settings");

var _metadataService = require("./metadata-service");

var _log = require("../shared/log");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthProviderManager = exports.AuthProviderManager = function () {
    function AuthProviderManager() {
        _classCallCheck(this, AuthProviderManager);

        for (var _len = arguments.length, providerSettingsItems = Array(_len), _key = 0; _key < _len; _key++) {
            providerSettingsItems[_key] = arguments[_key];
        }

        this._names = providerSettingsItems.map(function (s) {
            return s.name;
        });

        var oidcClientSettingsItems = providerSettingsItems.map(function (s) {
            return s instanceof _oidcClientSettings.OidcClientSettings ? s : new _oidcClientSettings.OidcClientSettings(s);
        });
        this.settingsItems = oidcClientSettingsItems;
        this.metadataServices = oidcClientSettingsItems.map(function (s) {
            return new _metadataService.MetadataService(s);
        });
    }

    AuthProviderManager.prototype.getSettings = function getSettings(name) {
        return this.settingsItems[this._names.indexOf(name)];
    };

    AuthProviderManager.prototype.getMetadataService = function getMetadataService(name) {
        return this.metadataServices[this._names.indexOf(name)];
    };

    AuthProviderManager.prototype.retrieveAllMetadata = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return Promise.all(this.metadataServices.map(function (ms) {
                                return ms.getMetadata();
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

    AuthProviderManager.prototype.getMetadataServiceByIssuer = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(issuer) {
            var index;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return getMetadataServicesIndex(this.metadataServices, issuer);

                        case 2:
                            index = _context2.sent;

                            if (!(index === -1)) {
                                _context2.next = 5;
                                break;
                            }

                            return _context2.abrupt("return", null);

                        case 5:
                            return _context2.abrupt("return", this.metadataServices[index]);

                        case 6:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getMetadataServiceByIssuer(_x) {
            return _ref2.apply(this, arguments);
        }

        return getMetadataServiceByIssuer;
    }();

    AuthProviderManager.prototype.getSettingsByIssuer = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(issuer) {
            var index;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return getMetadataServicesIndex(this.metadataServices, issuer);

                        case 2:
                            index = _context3.sent;

                            if (!(index === -1)) {
                                _context3.next = 5;
                                break;
                            }

                            return _context3.abrupt("return", null);

                        case 5:
                            return _context3.abrupt("return", this.settingsItems[index]);

                        case 6:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getSettingsByIssuer(_x2) {
            return _ref3.apply(this, arguments);
        }

        return getSettingsByIssuer;
    }();

    _createClass(AuthProviderManager, [{
        key: "names",
        get: function get() {
            return this._names;
        }
    }]);

    return AuthProviderManager;
}();