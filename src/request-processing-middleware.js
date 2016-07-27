import bodyParser from "koa-bodyparser";
import convert from "koa-convert";
import cors from "koa-cors";

// https://github.com/koajs/bodyparser
export let jsonBodyParser = bodyParser({
    enableTypes: ["json"],

    // http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
    onerror: (err, ctx) => ctx.throw('invalid syntax', 400)
});

// https://www.npmjs.com/package/koa-cors
export let corsConfig = convert(cors({
	origin: true
}));