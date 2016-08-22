import "babel-polyfill";

import {getDefaultComponents} from "./config";
import {AppLauncher} from "./app-launcher";

let components = getDefaultComponents();

AppLauncher.launch(components);
