import {Log} from "../../lib/shared/log";

export class MockDatabase {
    constructor(queryResultLookup) {
        this.queryResultLookup = queryResultLookup;
    }

	async open (connectionString) {
    }

    async close () {
    }

    async query (sql, params) {
        Log.info("Looking up db results for " + sql);
        return this.queryResultLookup[sql];
    }
}