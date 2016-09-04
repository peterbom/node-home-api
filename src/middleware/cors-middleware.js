import {Log} from "../shared/log";
import convert from "koa-convert";
import cors from "koa-cors";

// https://www.npmjs.com/package/koa-cors
export let corsConfig = convert(cors({
    origin: true,
    credentials: true
}));