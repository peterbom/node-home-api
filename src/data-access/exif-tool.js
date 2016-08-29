import path from "path";

var exec = require("child-process-promise").exec;

export class ExifTool {
    constructor () {
        this._toolPath = path.join(__dirname, "../../exiftool/exiftool.pl");
    }

    async getImageData(filePath) {
        return {};
    }

    async getTags(filePath) {
        let command = `perl ${this._toolPath} -s -a -j "${filePath}"`;

        let output = await exec(command);
        if (output.stdout) {
            return JSON.parse(output.stdout);
        } else {
            if (output.stderr) {
                throw output.stderr;
            } else {
                return [];
            }
        }
    }
}