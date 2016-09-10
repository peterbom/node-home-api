import {Log} from "../shared/log";
import promisify from "promisify-node";

let mv = promisify("mv");
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

    async move (fromFilePath, toFilePath) {
        await mv(fromFilePath, toFilePath, {mkdirp: true, clobber: false});
    }
}
