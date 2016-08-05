"use strict";

exports.__esModule = true;
exports.HttpClientJsonService = undefined;

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _log = require("../shared/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpClientJsonService = exports.HttpClientJsonService = function () {
    function HttpClientJsonService() {
        _classCallCheck(this, HttpClientJsonService);
    }

    HttpClientJsonService.prototype.getJson = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url, token) {
            var options, metadata;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            options = {
                                uri: url,
                                json: true
                            };


                            if (token) {
                                options.headers = {
                                    "Authorization": "Bearer " + token
                                };
                            }

                            _log.Log.info("getting json from " + url);

                            _context.next = 5;
                            return (0, _requestPromise2.default)(requestOptions);

                        case 5:
                            metadata = _context.sent;

                        case 6:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getJson(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return getJson;
    }();

    return HttpClientJsonService;
}();