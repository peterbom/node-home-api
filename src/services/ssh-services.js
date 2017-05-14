const NodeSsh = require("node-ssh");

const MaxConnectionAgeMinutes = 10;

class SshServices {
    constructor(host, port, username, privateKeyPath, localRoot, serverRoot) {
        // https://www.npmjs.com/package/node-ssh
        this._ssh = new NodeSsh();
        this._host = host;
        this._port = port;
        this._username = username;
        this._privateKeyPath = privateKeyPath;
        this._localRootRegex = new RegExp("^" + localRoot);
        this._serverRoot = serverRoot;

        this._connectionExpires = null;
    }

    async moveServerFiles(localSourcePath, localDestinationPath) {
        let serverSourcePath = localSourcePath.replace(this._localRootRegex, this._serverRoot);
        let serverDestinationPath = localDestinationPath.replace(this._localRootRegex, this._serverRoot);

        await this._connect();
        await this._ssh.exec("mv", [serverSourcePath, serverDestinationPath]);
    }

    async _connect() {
        if (this._connectionExpires) {
            if (this._connectionExpires > new Date()) {
                // Current connection still valid.
                return;
            }

            // Current connection expired. Close it.
            this._ssh.dispose();
        }

        await this._ssh.connect({
            host: this._host,
            port: this._port,
            username: this._username,
            privateKey: this._privateKeyPath
        });

        this._connectionExpires = new Date((new Date()).getTime() + MaxConnectionAgeMinutes * 60 * 1000);
    }
}

module.exports = exports = SshServices;

