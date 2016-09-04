import {Log} from "../shared/log";

export async function errorHandler (ctx, next) {
    // https://github.com/koajs/koa/wiki/Error-Handling
    try {
        await next();
    } catch (err) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Console/trace
        Log.error("Caught by error-handling middleware", err);

        ctx.status = err.status || 500;
        ctx.app.emit("error", err, ctx);
    }
}