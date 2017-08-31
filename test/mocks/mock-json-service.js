const Log = require("../../src/shared/log").Log;

class MockJsonService {
    constructor(jsonResponseLookup) {
        this.jsonResponseLookup = jsonResponseLookup;
    }

    getJson(url, token) {
        Log.info("Looking up JSON from " + url);
        return this.jsonResponseLookup[url];
    }

    postJson(url, obj, token) {
        Log.info("Posting JSON to " + url);
        return this.jsonResponseLookup[url];
    }
}

exports.MockJsonService = MockJsonService;