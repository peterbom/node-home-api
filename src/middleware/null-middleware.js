export function noop (ctx, next) {
	return next();
}