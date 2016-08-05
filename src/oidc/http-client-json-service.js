import rp from "request-promise";
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

        let metadata = await rp(options);
    }
}