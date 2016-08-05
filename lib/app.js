"use strict";

require("babel-polyfill");

var _config = require("./config");

var _globals = require("./globals");

(0, _globals.initialize)((0, _config.getDefaultSettings)());