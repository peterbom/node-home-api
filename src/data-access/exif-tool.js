import path from "path";
import moment from "moment";

var exec = require("child-process-promise").exec;

export class ExifTool {
    constructor () {
        this._toolPath = path.join(__dirname, "../../exiftool/exiftool.pl");
    }

    async getImageData(filePath) {
        return {};
    }

    async getAllTags(filePath) {
        let command = `perl ${this._toolPath} -s -a -j "${filePath}"`;

        let output = await exec(command);
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
            "-Subject",
            "-Keywords",
        ];

        let pathArgs = filePaths.map(p => `"${p}"`).join(" ");
        let command = `perl ${this._toolPath} -s -j ${properties.join(" ")} ${pathArgs}`;

        let output = await exec(command);

        if (!output.stdout) {
            if (output.stderr) {
                throw output.stderr;
            }

            return {};
        }

        let results = {};
        let infos = JSON.parse(output.stdout);
        for (let info of infos) {
            let takenDateTimeString = info.DateTimeOriginal ||
                info.CreateDate ||
                info.MediaCreateDate ||
                info.DateTime1 ||
                info.DateTime2;

            let takenDateTime;
            if (takenDateTimeString) {
                takenDateTime = moment(takenDateTimeString, "YYYY:MM:DD HH:mm:ssZ").toDate();
            }

            let fileModifyDate;
            if (info.FileModifyDate) {
                fileModifyDate = moment(info.FileModifyDate, "YYYY:MM:DD HH:mm:ssZ").toDate();
            }

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
                fileSize: info.FileSize,
                camera: camera,
                tags: tags,
                pixelCount: info.ImageWidth * info.ImageHeight,
                fileType: info.FileType
            };
        }

        return results;
    }
}
