"use strict";

exports.__esModule = true;
exports.noop = noop;
function noop(ctx, next) {
	return next();
}