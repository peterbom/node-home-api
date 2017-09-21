const {Log} = require("./shared/log");
const {EnvVarsProvider} = require("./shared/env-vars-provider");
const {AzureSecretRetriever} = require("./shared/azure-secret-retriever");
const {AppSettingsBuilder} = require("./shared/app-settings-builder");
const {AppLauncher} = require("./app-launcher");
const config = require("./config");

async function main() {
    let envVarsProvider = new EnvVarsProvider();
    let envVars = envVarsProvider.getEnvVars();

    Log.level = Number.parseInt(envVars["LOG_LEVEL"]);

    let applicationId = envVars["AZURE_APPLICATION_ID"];
    let applicationKey = envVars["AZURE_APPLICATION_KEY"];
    let vaultUri = envVars["AZURE_VAULT_URI"];
    if (!applicationId || !applicationKey || !vaultUri) {
        throw new Error("Environment variables AZURE_APPLICATION_ID, AZURE_APPLICATION_KEY and AZURE_VAULT_URI must all be specified");
    }

    let secretRetriever = new AzureSecretRetriever(applicationId, applicationKey, vaultUri);
    let settingsBuilder = new AppSettingsBuilder();
    let settings = await settingsBuilder.buildSettings(envVars, secretRetriever);

    let components = config.getDefaultComponents(settings);
    AppLauncher.launch(settings, components);
}

main().catch(Log.error);