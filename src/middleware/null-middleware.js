const Log = require("../shared/log").Log;

exports.noop = (ctx, next) => {
	return next();
}