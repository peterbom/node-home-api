import bodyParser from "koa-bodyparser";

// https://github.com/koajs/bodyparser
export let jsonBodyParser = bodyParser({
    enableTypes: ["json"],

    // http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
    onerror: (err, ctx) => ctx.throw('invalid syntax', 400)
});
