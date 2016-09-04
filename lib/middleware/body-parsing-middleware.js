"use strict";

exports.__esModule = true;
exports.jsonBodyParser = undefined;

var _log = require("../shared/log");

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/koajs/bodyparser
var jsonBodyParser = exports.jsonBodyParser = (0, _koaBodyparser2.default)({
    enableTypes: ["json"],

    // http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
    onerror: function onerror(err, ctx) {
        return ctx.throw('invalid syntax', 400);
    }
});