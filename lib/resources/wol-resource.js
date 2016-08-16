"use strict";

exports.__esModule = true;
exports.WolResource = undefined;

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wol = (0, _promisifyNode2.default)("wake_on_lan");

var WolResource = exports.WolResource = function () {
    function WolResource(macAddressLookup) {
        _classCallCheck(this, WolResource);

        this._macAddressLookup = macAddressLookup;
    }

    WolResource.prototype.send = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            var macAddress;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            macAddress = this._macAddressLookup[ctx.params.id];
                            _context.next = 3;
                            return wol.wake(macAddress, {
                                address: "192.168.1.255"
                            });

                        case 3:

                            ctx.status = 200;

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function send(_x) {
            return _ref.apply(this, arguments);
        }

        return send;
    }();

    return WolResource;
}();