"use strict";

exports.__esModule = true;
exports.ImageDataAccess = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageDataAccess = exports.ImageDataAccess = function () {
    function ImageDataAccess(dbManager) {
        _classCallCheck(this, ImageDataAccess);

        this._imageInfos = dbManager.get("imageInfos");
        this._imageInfos.ensureIndex({ "path": 1, "filename": 1 });
        this._imageInfos.ensureIndex({ "hash": 1 });
    }

    ImageDataAccess.prototype.hasUnknownFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path, filenames) {
            var matches, knownFilenames;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            path = path.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });
                            _context.next = 4;
                            return this._imageInfos.find({ path: path, filename: { $in: filenames } }, { filename: 1 });

                        case 4:
                            matches = _context.sent;
                            knownFilenames = matches.map(function (m) {
                                return m.filename;
                            });
                            return _context.abrupt("return", filenames.some(function (f) {
                                return knownFilenames.indexOf(f) < 0;
                            }));

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function hasUnknownFiles(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return hasUnknownFiles;
    }();

    ImageDataAccess.prototype.upsertImage = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(directory, filename, imageProperties) {
            var image;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            image = {
                                path: directory.toLowerCase(),
                                filename: filename.toLowerCase(),
                                hash: getImageHash(imageProperties),
                                properties: imageProperties
                            };
                            _context2.next = 3;
                            return this._imageInfos.findOneAndUpdate({ path: image.path, filename: image.filename }, { $set: image }, { upsert: true });

                        case 3:
                            image = _context2.sent;

                            if (image.pathHistory) {
                                _context2.next = 9;
                                break;
                            }

                            image.pathHistory = [{
                                date: new Date(),
                                filePath: _path2.default.join(image.path, image.filename)
                            }];

                            _context2.next = 8;
                            return this._imageInfos.update({ _id: image._id }, image);

                        case 8:
                            image = _context2.sent;

                        case 9:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function upsertImage(_x3, _x4, _x5) {
            return _ref2.apply(this, arguments);
        }

        return upsertImage;
    }();
    /*
        async hasImage(inode) {
            let result = await this._imageInfos.findOne({inode: inode}, {_id: 1});
            return !!result;
        }
    
        async findImage(inode) {
            return await this._imageInfos.findOne({inode: inode});
        }
    
        async upsertLocation(inode, path, filename) {
            let updates = {
                inode: inode,
                path: path.toLowerCase(),
                filename: filename.toLowerCase()
            }
    
            return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
        }
    
        async upsertImage(inode, path, filename, imageData, tags) {
            let updates = {
                inode: inode,
                path: path.toLowerCase(),
                filename: filename.toLowerCase(),
                imageData: imageData,
                tags: tags
            };
    
            return await this._imageInfos.findOneAndUpdate({inode: inode}, {$set: updates}, {upsert: true});
        }
    */


    return ImageDataAccess;
}();

function getImageHash(imageProperties) {
    var identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime || imageProperties.fileModifyDate,
        pixels: imageProperties.pixelCount
    };

    return (0, _md2.default)(JSON.stringify(identifiers));
}