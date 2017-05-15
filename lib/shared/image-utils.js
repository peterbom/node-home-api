"use strict";

exports.__esModule = true;
exports.ImageUtils = undefined;

var _log = require("./log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageUtils = exports.ImageUtils = function () {
    function ImageUtils(targetPhotoPath) {
        _classCallCheck(this, ImageUtils);

        this._targetPhotoPath = targetPhotoPath;
    }

    ImageUtils.prototype.getImageHash = function getImageHash(imageProperties) {
        if (!imageProperties) {
            return null;
        }

        if (!imageProperties.takenDateTime) {
            return null;
        }

        // Only include identifiers that affect the resulting
        // filename, because we want to ensure that filename
        // conflicts can be reliably detected by hash conflicts.
        var identifiers = {
            type: imageProperties.fileType,
            date: imageProperties.takenDateTime,
            camera: imageProperties.camera,
            number: imageProperties.imageNumber
        };

        return (0, _md2.default)(JSON.stringify(identifiers));
    };

    ImageUtils.prototype.getDestinationDirectoryPath = function getDestinationDirectoryPath(imageProperties) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return null;
        }

        var takenMoment = (0, _moment2.default)(imageProperties.takenDateTime);
        return _path2.default.join(this._targetPhotoPath, takenMoment.format("YYYY-MM"));
    };

    ImageUtils.prototype.getDestinationFilename = function getDestinationFilename(imageProperties, filename) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return null;
        }

        var takenMoment = (0, _moment2.default)(imageProperties.takenDateTime);
        var filenameParts = [takenMoment.format("DD HH_mm_ss"), (imageProperties.camera || "").trim().toLowerCase(), imageProperties.imageNumber].filter(function (p) {
            return !!p;
        });

        return filenameParts.join(" ") + _path2.default.extname(filename).toLowerCase();
    };

    ImageUtils.prototype.requiresMovement = function requiresMovement(directoryPath, filename, imageProperties) {
        if (!imageProperties || !imageProperties.takenDateTime) {
            return false;
        }

        var currentPath = _path2.default.join(directoryPath, filename);
        var destinationPath = _path2.default.join(this.getDestinationDirectoryPath(imageProperties), this.getDestinationFilename(imageProperties, filename));

        return currentPath !== destinationPath;
    };

    return ImageUtils;
}();