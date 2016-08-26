"use strict";

exports.__esModule = true;
exports.MachineStatusResource = undefined;

var requestOnline = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(macAddress) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return wol.wake(macAddress, {
                            address: "192.168.1.255"
                        });

                    case 2:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function requestOnline(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var requestOffline = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ipAddress) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function requestOffline(_x4) {
        return _ref4.apply(this, arguments);
    };
}();

var _ping = require("ping");

var _ping2 = _interopRequireDefault(_ping);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wol = (0, _promisifyNode2.default)("wake_on_lan");

var MachineStatusResource = exports.MachineStatusResource = function () {
    function MachineStatusResource(machineLookup) {
        _classCallCheck(this, MachineStatusResource);

        this._machineLookup = machineLookup;
    }

    MachineStatusResource.prototype.query = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var ipAddress, response;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            ipAddress = this._machineLookup[ctx.params.id].ipAddress;

                            // https://www.npmjs.com/package/ping

                            _context.next = 3;
                            return _ping2.default.promise.probe(ipAddress, {
                                timeout: 2,
                                numeric: false
                            });

                        case 3:
                            response = _context.sent;

                            if (!response.alive) {
                                _context.next = 6;
                                break;
                            }

                            return _context.abrupt("return", {
                                status: "online"
                            });

                        case 6:
                            return _context.abrupt("return", {
                                status: "offline"
                            });

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function query(_x) {
            return _ref.apply(this, arguments);
        }

        return query;
    }();

    MachineStatusResource.prototype.request = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var machineDetails, requestedStatus;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            machineDetails = this._machineLookup[ctx.params.id];
                            requestedStatus = ctx.request.body.status;
                            _context2.t0 = requestedStatus;
                            _context2.next = _context2.t0 === "online" ? 5 : _context2.t0 === "offline" ? 8 : 11;
                            break;

                        case 5:
                            _context2.next = 7;
                            return requestOnline(machineDetails.macAddress);

                        case 7:
                            return _context2.abrupt("break", 11);

                        case 8:
                            _context2.next = 10;
                            return requestOffline(machineDetails.ipAddress);

                        case 10:
                            return _context2.abrupt("break", 11);

                        case 11:

                            ctx.status = 200;

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function request(_x2) {
            return _ref2.apply(this, arguments);
        }

        return request;
    }();

    return MachineStatusResource;
}();