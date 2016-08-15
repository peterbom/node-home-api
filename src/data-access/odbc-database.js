import odbc from "odbc";
import promisify from "promisify-node";

export class OdbcDatabase {
    constructor(connectionString) {
        if (connectionString === undefined) {
            throw new Error("connectionString not defined");
        }

        this._database = new odbc.Database();
        this._connectionString = connectionString;
    }

    async open () {
        return await new Promise((resolve, reject) => {
            this._database.open(this._connectionString, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async close () {
        await new Promise((resolve, reject) => {
            this._database.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async query (sql, params) {
        return await new Promise((resolve, reject) => {
            this._database.query(sql, params, (err, result) => {
                if (err) {
                    console.log(`-- Error running query:\n${sql}\n${err}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async withOpenConnection (action = db => {}) {
        await this.open();
        try {
            return await action(this);
        } finally {
            await this.close();
        }
    }
}