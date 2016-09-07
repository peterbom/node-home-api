import {Log} from "../shared/log";
import promisify from "promisify-node";

let fs = promisify("fs");

export class FileServices {
    constructor () {
    }

    async exists (filePath) {
        try {
            let stats = await fs.stat(filePath);
            return stats && stats.isFile();
        } catch (err) {
            return false;
        }
    }

    async delete (filePath) {
        await fs.unlink(filePath);
    }
}
