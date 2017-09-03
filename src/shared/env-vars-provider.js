const path = require("path");
const zoo = require("zoo");

class EnvVarsProvider {
    getEnvVars() {
        let launchDir = process.cwd();
        let envFilePath = path.join(launchDir, ".env");
        let envFileVars;
        try {
            envFileVars = zoo.get(envFilePath);
        } catch (err) {
            // E.g. no .env file exists
            envFileVars = process.env;
        }

        // Let environment variables take precedence over those defined in a file (so that we can
        // override file variables using launch arguments).
        return Object.assign({}, envFileVars, process.env);
    }
}

exports.EnvVarsProvider = EnvVarsProvider;