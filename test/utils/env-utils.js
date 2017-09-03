const path = require("path");
const zoo = require("zoo");

exports.getTestEnvVars = () => {
    let launchDir = process.cwd();
    let envFilePath = path.join(launchDir, "test/.env");
    let envFileVars;
    try {
        envFileVars = zoo.get(envFilePath);
    } catch (err) {
        // E.g. no .env file exists
        envFileVars = process.env;
    }

    return Object.assign({}, envFileVars, process.env);
}