"use strict";

exports.__esModule = true;
exports.corsConfig = exports.jsonBodyParser = undefined;

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaConvert = require("koa-convert");

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaCors = require("koa-cors");

var _koaCors2 = _interopRequireDefault(_koaCors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/koajs/bodyparser
var jsonBodyParser = exports.jsonBodyParser = (0, _koaBodyparser2.default)({
    enableTypes: ["json"],

    // http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
    onerror: function onerror(err, ctx) {
        return ctx.throw('invalid syntax', 400);
    }
});

// https://www.npmjs.com/package/koa-cors
var corsConfig = exports.corsConfig = (0, _koaConvert2.default)((0, _koaCors2.default)({
    origin: true,
    credentials: true
}));