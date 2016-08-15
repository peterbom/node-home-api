"use strict";

require("babel-polyfill");

var _config = require("./config");

var _appLauncher = require("./app-launcher");

var settings = (0, _config.getDefaultSettings)();
var components = (0, _config.getDefaultComponents)(settings);

_appLauncher.AppLauncher.launch(components);