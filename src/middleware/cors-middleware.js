const Log = require("../shared/log").Log;
const convert = require("koa-convert");
const cors = require("koa-cors");

// https://www.npmjs.com/package/koa-cors
exports.corsConfig = convert(cors({
    origin: true,
    credentials: true
}));