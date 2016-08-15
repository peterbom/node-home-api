import rp from "request-promise";

// TODO: Logging
import {Log} from "../shared/log";

export class HttpClientJsonService {
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
}