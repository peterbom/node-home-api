import "babel-polyfill";

import {getDefaultSettings, getDefaultComponents} from "./config";
import {AppLauncher} from "./app-launcher";

let settings = getDefaultSettings();
let components = getDefaultComponents(settings);

AppLauncher.launch(components);
