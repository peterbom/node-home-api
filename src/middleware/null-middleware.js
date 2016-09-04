import {Log} from "../shared/log";

export function noop (ctx, next) {
	return next();
}