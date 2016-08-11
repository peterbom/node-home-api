import odbc from "odbc";
import promisify from "promisify-node";

export class Database {
    constructor(options) {
        this._database = new odbc.Database(options);
    }

    async open (connectionString) {
        return await new Promise((resolve, reject) => {
            this._database.open(connectionString, (err, result) => {
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
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}