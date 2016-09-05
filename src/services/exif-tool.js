import {Log} from "../shared/log";
import path from "path";
import moment from "moment";

var exec = require("child-process-promise").exec;
const timeout = 60000; // 1 minute

export class ExifTool {
    constructor () {
        this._toolPath = path.join(__dirname, "../../exiftool/exiftool.pl");
    }

    async getThumbnail(filePath) {
        let command = `perl ${this._toolPath} -b -ThumbnailImage "${filePath}"`;

        let output = await exec(command, {
            encoding: "binary",
            maxBuffer: 100*1024,
            timeout: timeout
        });

        if (output.stdout) {
            return new Buffer(output.stdout, "binary");
        } else {
            if (output.stderr) {
                throw output.stderr;
            } else {
                return null;
            }
        }
    }

    async getAllTags(filePath) {
        let command = `perl ${this._toolPath} -s -a -j "${filePath}"`;

        let output = await exec(command, {timeout: timeout});
        if (output.stdout) {
            return JSON.parse(output.stdout)[0];
        } else {
            if (output.stderr) {
                throw output.stderr;
            } else {
                return {};
            }
        }
    }

    async getProperties(...filePaths) {
        let properties = [
            "-DateTimeOriginal",
            "-CreateDate",
            "-DateTime1",
            "-DateTime2",
            "-MediaCreateDate",
            "-FileCreateDate",
            "-FileModifyDate",
            "-Make",
            "-Model",
            "-Software",
            "-CreatorTool",
            "-FileName",
            "-FileType",
            "-FileSize",
            "-ImageWidth",
            "-ImageHeight",
            "-ImageNumber",
            "-Subject",
            "-Keywords",
        ];

        let pathArgs = filePaths.map(p => `"${p}"`).join(" ");
        let command = `perl ${this._toolPath} -s -j ${properties.join(" ")} ${pathArgs}`;

        let infos = [];
        try {
            let output = await exec(command, {timeout: timeout});

            if (!output.stdout) {
                if (output.stderr) {
                    throw output.stderr;
                }

                return null;
            }

            infos = JSON.parse(output.stdout);
        } catch (error) {
            return null;
        }

        let results = {};
        for (let info of infos) {
            let takenDateTime = null;
            ["DateTimeOriginal", "CreateDate", "MediaCreateDate", "DateTime1", "DateTime2"].forEach(prop => {
                takenDateTime = takenDateTime || tryGetDate(info[prop]);
            });

            let fileModifyDate = tryGetDate(info.FileModifyDate);
            let fileCreateDate = tryGetDate(info.FileCreateDate);

            let camera = ((info.Make || "") + " " + (info.Model || "")).trim() ||
                info.Software ||
                info.CreatorTool;

            let tags = [];
            if (info.Subject) {
                if (typeof info.Subject === 'string') {
                    tags = tags.concat(info.Subject.split(","));
                } else {
                    tags = tags.concat(info.Subject);
                }
            }
            
            let keywordTags = [];
            if (info.Keywords) {
                if (typeof info.Keywords === 'string') {
                    keywordTags = keywordTags.concat(info.Keywords.split(","));
                } else {
                    keywordTags = keywordTags.concat(info.Keywords);
                }
            }

            for (let i = 0; i < keywordTags.length; i++) {
                let keyword = keywordTags[i];
                if (tags.indexOf(keyword) === -1) {
                    tags.push(keyword);
                }
            }

            results[info.FileName] = {
                takenDateTime: takenDateTime,
                fileModifyDate: fileModifyDate,
                fileCreateDate: fileCreateDate,
                fileSize: info.FileSize,
                camera: camera,
                tags: tags,
                pixelCount: info.ImageWidth * info.ImageHeight,
                imageNumber: info.imageNumber || 0,
                fileType: info.FileType
            };
        }

        return results;
    }

    async setImageNumber (filePath, imageNumber) {
        // TODO: Consider whether to add -overwrite_original_in_place flag.
        // http://www.sno.phy.queensu.ca/~phil/exiftool/exiftool_pod.html
        let command = `perl ${this._toolPath} -ImageNumber=${imageNumber} "${filePath}"`;

        await exec(command, {timeout: timeout});
    }
}

function tryGetDate (stringValue) {
    if (stringValue) {
        let time = moment(stringValue, "YYYY:MM:DD HH:mm:ssZ");
        if (time && time.year() > 1970 && time.year() <= moment().year()) {
            return time.toDate();
        }
    }

    return null;
}
