"use strict";

exports.__esModule = true;
exports.corsConfig = undefined;

var _log = require("../shared/log");

var _koaConvert = require("koa-convert");

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaCors = require("koa-cors");

var _koaCors2 = _interopRequireDefault(_koaCors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.npmjs.com/package/koa-cors
var corsConfig = exports.corsConfig = (0, _koaConvert2.default)((0, _koaCors2.default)({
    origin: true,
    credentials: true
}));