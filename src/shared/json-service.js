const Log = require("./log").Log;
const rp = require("request-promise");

class JsonService {
    async getJson(url, token) {
        let options = {
            uri: url,
            json: true
        };

        if (token) {
            options.headers = {
                "Authorization": "Bearer " + token
            };
        }

        Log.info(`getting json from ${url}`);

        return await rp(options);
    }

    async postJson(url, obj, token) {
        let options = {
            method: "POST",
            uri: url,
            body: obj,
            json: true
        };

        if (token) {
            options.headers = {
                "Authorization": "Bearer " + token
            };
        }

        Log.info(`posting json to ${url}`);

        return await rp(options);
    }
}

exports.JsonService = JsonService;