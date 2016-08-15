"use strict";

exports.__esModule = true;
exports.MetadataService = undefined;

var _log = require("../shared/log");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

// TODO: Logging


var MetadataService = exports.MetadataService = function () {
    function MetadataService(settings, jsonService) {
        _classCallCheck(this, MetadataService);

        if (settings === undefined) {
            throw new Error("settings not defined");
        }

        if (jsonService === undefined) {
            throw new Error("jsonService not defined");
        }

        this._settings = settings;
        this._jsonService = jsonService;
        this._metadata = null;
    }

    MetadataService.prototype.getMetadata = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var metadata;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _log.Log.info("MetadataService.getMetadata");

                            if (!(this._metadata && this._metadata.expiry > new Date())) {
                                _context.next = 4;
                                break;
                            }

                            _log.Log.info("Returning metadata from settings");
                            return _context.abrupt("return", this._metadata);

                        case 4:
                            if (this._settings.metadataUrl) {
                                _context.next = 7;
                                break;
                            }

                            _log.Log.error("No metadataUrl configured on settings");
                            throw new Error("No metadataUrl configured on settings");

                        case 7:
                            _context.next = 9;
                            return this._jsonService.getJson(this._settings.metadataUrl);

                        case 9:
                            metadata = _context.sent;

                            _log.Log.info("json received");

                            metadata.expiry = (0, _moment2.default)().add(1, "hour").toDate();
                            this._metadata = metadata;

                            return _context.abrupt("return", metadata);

                        case 14:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getMetadata() {
            return _ref.apply(this, arguments);
        }

        return getMetadata;
    }();

    MetadataService.prototype.getIssuer = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _log.Log.info("MetadataService.getIssuer");
                            _context2.next = 3;
                            return this._getMetadataProperty("issuer");

                        case 3:
                            return _context2.abrupt("return", _context2.sent);

                        case 4:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getIssuer() {
            return _ref2.apply(this, arguments);
        }

        return getIssuer;
    }();

    MetadataService.prototype.getAuthorizationEndpoint = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _log.Log.info("MetadataService.getAuthorizationEndpoint");
                            _context3.next = 3;
                            return this._getMetadataProperty("authorization_endpoint");

                        case 3:
                            return _context3.abrupt("return", _context3.sent);

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getAuthorizationEndpoint() {
            return _ref3.apply(this, arguments);
        }

        return getAuthorizationEndpoint;
    }();

    MetadataService.prototype.getUserInfoEndpoint = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _log.Log.info("MetadataService.getUserInfoEndpoint");
                            _context4.next = 3;
                            return this._getMetadataProperty("userinfo_endpoint");

                        case 3:
                            return _context4.abrupt("return", _context4.sent);

                        case 4:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function getUserInfoEndpoint() {
            return _ref4.apply(this, arguments);
        }

        return getUserInfoEndpoint;
    }();

    MetadataService.prototype.getCheckSessionIframe = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _log.Log.info("MetadataService.getCheckSessionIframe");
                            _context5.next = 3;
                            return this._getMetadataProperty("check_session_iframe");

                        case 3:
                            return _context5.abrupt("return", _context5.sent);

                        case 4:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function getCheckSessionIframe() {
            return _ref5.apply(this, arguments);
        }

        return getCheckSessionIframe;
    }();

    MetadataService.prototype.getEndSessionEndpoint = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _log.Log.info("MetadataService.getEndSessionEndpoint");
                            _context6.next = 3;
                            return this._getMetadataProperty("end_session_endpoint");

                        case 3:
                            return _context6.abrupt("return", _context6.sent);

                        case 4:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function getEndSessionEndpoint() {
            return _ref6.apply(this, arguments);
        }

        return getEndSessionEndpoint;
    }();

    MetadataService.prototype._getMetadataProperty = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(name) {
            var metadata;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _log.Log.info("MetadataService._getMetadataProperty", name);

                            _context7.next = 3;
                            return this.getMetadata();

                        case 3:
                            metadata = _context7.sent;


                            _log.Log.info("metadata recieved");

                            if (!(metadata[name] === undefined)) {
                                _context7.next = 8;
                                break;
                            }

                            _log.Log.error("Metadata does not contain property " + name);
                            throw new Error("Metadata does not contain property " + name);

                        case 8:
                            return _context7.abrupt("return", metadata[name]);

                        case 9:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function _getMetadataProperty(_x) {
            return _ref7.apply(this, arguments);
        }

        return _getMetadataProperty;
    }();

    MetadataService.prototype.getSigningKeys = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
            var jwks_uri, keySet, filteredKeys;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _log.Log.info("MetadataService.getSigningKeys");

                            if (!this._settings.signingKeys) {
                                _context8.next = 4;
                                break;
                            }

                            _log.Log.info("Returning signingKeys from settings");
                            return _context8.abrupt("return", this._settings.signingKeys);

                        case 4:
                            _context8.next = 6;
                            return this._getMetadataProperty("jwks_uri");

                        case 6:
                            jwks_uri = _context8.sent;

                            _log.Log.info("jwks_uri received", jwks_uri);

                            _context8.next = 10;
                            return this._jsonService.getJson(jwks_uri);

                        case 10:
                            keySet = _context8.sent;

                            _log.Log.info("key set received", keySet);

                            if (keySet.keys) {
                                _context8.next = 15;
                                break;
                            }

                            _log.Log.error("Missing keys on keyset");
                            throw new Error("Missing keys on keyset");

                        case 15:
                            filteredKeys = this._filterSigningKeys(keySet.keys);

                            _log.Log.info("filtered keys", filteredKeys);

                            this._settings.signingKeys = filteredKeys;
                            return _context8.abrupt("return", this._settings.signingKeys);

                        case 19:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function getSigningKeys() {
            return _ref8.apply(this, arguments);
        }

        return getSigningKeys;
    }();

    MetadataService.prototype._filterSigningKeys = function _filterSigningKeys(keys) {
        _log.Log.info("MetadataService._filterSigningKeys", keys);

        return keys.filter(function (item) {
            return item.use === "sig";
        });
    };

    return MetadataService;
}();