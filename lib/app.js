"use strict";

require("babel-polyfill");

var _config = require("./config");

var _appLauncher = require("./app-launcher");

var components = (0, _config.getDefaultComponents)();

_appLauncher.AppLauncher.launch(components);