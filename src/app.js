import "babel-polyfill";

import {Log} from "./shared/log";
import {getDefaultComponents} from "./config";
import {AppLauncher} from "./app-launcher";

let components = getDefaultComponents();

AppLauncher.launch(components);
