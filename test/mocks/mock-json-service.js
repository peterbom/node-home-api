import {Log} from "../../lib/shared/log";

export class MockJsonService {
    constructor(jsonResponseLookup) {
        this.jsonResponseLookup = jsonResponseLookup;
    }

    getJson(url, token) {
        Log.info("Looking up JSON from " + url);
        return this.jsonResponseLookup[url];
    }
}