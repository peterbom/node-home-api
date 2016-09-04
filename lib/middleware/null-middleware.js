"use strict";

exports.__esModule = true;
exports.noop = noop;

var _log = require("../shared/log");

function noop(ctx, next) {
	return next();
}