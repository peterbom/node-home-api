const Log = require("./shared/log").Log;
const config = require("./config");
const AppLauncher = require("./app-launcher").AppLauncher;

let components = config.getDefaultComponents();

AppLauncher.launch(components);
