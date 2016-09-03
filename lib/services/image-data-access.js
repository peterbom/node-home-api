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
        this._imageInfos.ensureIndex({ "directoryPath": 1, "filename": 1 });
        this._imageInfos.ensureIndex({ "hash": 1 });
    }

    ImageDataAccess.prototype.getById = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._imageInfos.findOne({ _id: id });

                        case 2:
                            return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getById(_x) {
            return _ref.apply(this, arguments);
        }

        return getById;
    }();

    ImageDataAccess.prototype.getDiff = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(directoryPath, filenames) {
            var indexedResults, result, filenameLookup, indexedFilenameLookup, filename, _filename;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });

                            _context2.next = 4;
                            return this._imageInfos.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 4:
                            indexedResults = _context2.sent;
                            result = {
                                new: [],
                                deleted: []
                            };

                            if (!(indexedResults.length === 0)) {
                                _context2.next = 9;
                                break;
                            }

                            result.new = filenames;
                            return _context2.abrupt("return", result);

                        case 9:
                            filenameLookup = {};

                            filenames.forEach(function (f) {
                                return filenameLookup[f] = true;
                            });

                            indexedFilenameLookup = {};

                            indexedResults.forEach(function (m) {
                                return indexedFilenameLookup[m.filename] = true;
                            });

                            for (filename in filenameLookup) {
                                if (!indexedFilenameLookup[filename]) {
                                    result.new.push(filename);
                                }
                            }

                            for (_filename in indexedFilenameLookup) {
                                if (!filenameLookup[_filename]) {
                                    result.deleted.push(_filename);
                                }
                            }

                            return _context2.abrupt("return", result);

                        case 16:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getDiff(_x2, _x3) {
            return _ref2.apply(this, arguments);
        }

        return getDiff;
    }();

    ImageDataAccess.prototype.getIndexedDirectories = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var groups;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._imageInfos.aggregate({ $group: { _id: "$directoryPath", count: { $sum: 1 } } });

                        case 2:
                            groups = _context3.sent;
                            return _context3.abrupt("return", groups.map(function (g) {
                                return {
                                    directoryPath: g._id,
                                    imageCount: g.count
                                };
                            }));

                        case 4:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getIndexedDirectories() {
            return _ref3.apply(this, arguments);
        }

        return getIndexedDirectories;
    }();

    ImageDataAccess.prototype.getImageFilenames = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(directoryPath) {
            var images;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            _context4.next = 3;
                            return this._imageInfos.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 3:
                            images = _context4.sent;
                            return _context4.abrupt("return", images.map(function (i) {
                                return i.filename;
                            }));

                        case 5:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function getImageFilenames(_x4) {
            return _ref4.apply(this, arguments);
        }

        return getImageFilenames;
    }();

    ImageDataAccess.prototype.cleanExcept = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(directoryPath, filenames) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filenames = filenames.map(function (f) {
                                return f.toLowerCase();
                            });
                            _context5.next = 4;
                            return this._imageInfos.remove({ directoryPath: directoryPath, filename: { $nin: filenames } });

                        case 4:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function cleanExcept(_x5, _x6) {
            return _ref5.apply(this, arguments);
        }

        return cleanExcept;
    }();

    ImageDataAccess.prototype.invalidateImage = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(directoryPath, filename) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filename = filename.toLowerCase();

                            _context6.next = 4;
                            return this._imageInfos.update({ directoryPath: directoryPath, filename: filename }, { $set: { valid: false } });

                        case 4:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function invalidateImage(_x7, _x8) {
            return _ref6.apply(this, arguments);
        }

        return invalidateImage;
    }();

    ImageDataAccess.prototype.invalidateImages = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(directoryPath) {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            _context7.next = 3;
                            return this._imageInfos.update({ directoryPath: directoryPath }, { $set: { valid: false } }, { multi: true });

                        case 3:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function invalidateImages(_x9) {
            return _ref7.apply(this, arguments);
        }

        return invalidateImages;
    }();

    ImageDataAccess.prototype.upsertImage = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(directoryPath, filename, imageProperties /* Can be null */) {
            var image;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            directoryPath = directoryPath.toLowerCase();
                            filename = filename.toLowerCase();

                            image = {
                                directoryPath: directoryPath,
                                filename: filename,
                                hash: getImageHash(imageProperties),
                                properties: imageProperties,
                                valid: true
                            };
                            _context8.next = 5;
                            return this._imageInfos.findOneAndUpdate({ directoryPath: directoryPath, filename: filename }, { $set: image }, { upsert: true });

                        case 5:
                            image = _context8.sent;

                            if (image.pathHistory) {
                                _context8.next = 11;
                                break;
                            }

                            image.pathHistory = [{
                                date: imageProperties.fileCreateDate,
                                filePath: _path2.default.join(directoryPath, filename)
                            }];

                            _context8.next = 10;
                            return this._imageInfos.update({ _id: image._id }, image);

                        case 10:
                            image = _context8.sent;

                        case 11:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function upsertImage(_x10, _x11, _x12) {
            return _ref8.apply(this, arguments);
        }

        return upsertImage;
    }();

    ImageDataAccess.prototype.getDuplicates = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
            var _this = this;

            var groups, result, resultPromises, _loop, _iterator, _isArray, _i, _ref10, _ret;

            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return this._imageInfos.aggregate({ $group: { _id: "$hash", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $match: { count: { $gt: 1 } } });

                        case 2:
                            groups = _context10.sent;
                            result = {};
                            resultPromises = [];

                            _loop = function _loop() {
                                if (_isArray) {
                                    if (_i >= _iterator.length) return "break";
                                    _ref10 = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) return "break";
                                    _ref10 = _i.value;
                                }

                                var group = _ref10;

                                var updateResult = function () {
                                    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
                                        return regeneratorRuntime.wrap(function _callee9$(_context9) {
                                            while (1) {
                                                switch (_context9.prev = _context9.next) {
                                                    case 0:
                                                        _context9.next = 2;
                                                        return _this._imageInfos.find({ hash: hash });

                                                    case 2:
                                                        result[group.hash] = _context9.sent;

                                                    case 3:
                                                    case "end":
                                                        return _context9.stop();
                                                }
                                            }
                                        }, _callee9, _this);
                                    }));

                                    return function updateResult() {
                                        return _ref11.apply(this, arguments);
                                    };
                                }();

                                resultPromises.push(updateResult());
                            };

                            _iterator = groups, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 7:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context10.next = 10;
                                break;
                            }

                            return _context10.abrupt("break", 12);

                        case 10:
                            _context10.next = 7;
                            break;

                        case 12:
                            _context10.next = 14;
                            return Promise.all(resultPromises);

                        case 14:
                            return _context10.abrupt("return", result);

                        case 15:
                        case "end":
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function getDuplicates() {
            return _ref9.apply(this, arguments);
        }

        return getDuplicates;
    }();

    ImageDataAccess.prototype.combineDuplicateHistories = function () {
        var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(ids) {
            var _this2 = this;

            var duplicates, hash, allPathHistoryEvents, uniquePathHistoryEvents, lastEvent, _iterator2, _isArray2, _i2, _ref13, pathHistoryEvent, updatePromises, _loop2, _iterator3, _isArray3, _i3, _ref14, _ret2;

            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.next = 2;
                            return this._imageInfos.find({ _id: { $in: ids } });

                        case 2:
                            duplicates = _context11.sent;

                            if (!(duplicates.length < 2)) {
                                _context11.next = 5;
                                break;
                            }

                            return _context11.abrupt("return");

                        case 5:
                            hash = duplicates[0].hash;

                            if (!duplicates.some(function (d) {
                                return d.hash !== hash;
                            })) {
                                _context11.next = 8;
                                break;
                            }

                            throw new Error("Expect all duplicates to have the same hash");

                        case 8:

                            // Merge all the pathHistories together and order by date
                            allPathHistoryEvents = duplicates.reduce(function (img1, img2) {
                                return img1.pathHistory.concat(img2.pathHistory);
                            }, []).sort(function (event1, event2) {
                                return event1.date - event2.date;
                            });

                            // Remove duplicates (including events where the path is unchanged)

                            uniquePathHistoryEvents = [];
                            lastEvent = null;
                            _iterator2 = uniquePathHistoryEvents, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 12:
                            if (!_isArray2) {
                                _context11.next = 18;
                                break;
                            }

                            if (!(_i2 >= _iterator2.length)) {
                                _context11.next = 15;
                                break;
                            }

                            return _context11.abrupt("break", 26);

                        case 15:
                            _ref13 = _iterator2[_i2++];
                            _context11.next = 22;
                            break;

                        case 18:
                            _i2 = _iterator2.next();

                            if (!_i2.done) {
                                _context11.next = 21;
                                break;
                            }

                            return _context11.abrupt("break", 26);

                        case 21:
                            _ref13 = _i2.value;

                        case 22:
                            pathHistoryEvent = _ref13;

                            if (!lastEvent || lastEvent.path !== pathHistoryEvent.path) {
                                uniquePathHistoryEvents.push(pathHistoryEvent);
                                lastEvent = pathHistoryEvent;
                            }

                        case 24:
                            _context11.next = 12;
                            break;

                        case 26:

                            // For each duplicate, the path history includes all events up to and including
                            // the current latest date
                            updatePromises = [];

                            _loop2 = function _loop2() {
                                if (_isArray3) {
                                    if (_i3 >= _iterator3.length) return "break";
                                    _ref14 = _iterator3[_i3++];
                                } else {
                                    _i3 = _iterator3.next();
                                    if (_i3.done) return "break";
                                    _ref14 = _i3.value;
                                }

                                var duplicate = _ref14;

                                var latestDate = duplicate.pathHistory[duplicates.pathHistory.length - 1].date;
                                duplicate.pathHistory = uniquePathHistoryEvents.filter(function (event) {
                                    return event.date <= latestDate;
                                });

                                updatePromises.push(_this2._imageInfos.update({ _id: duplicate._id }, duplicate));
                            };

                            _iterator3 = duplicates, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();

                        case 29:
                            _ret2 = _loop2();

                            if (!(_ret2 === "break")) {
                                _context11.next = 32;
                                break;
                            }

                            return _context11.abrupt("break", 34);

                        case 32:
                            _context11.next = 29;
                            break;

                        case 34:
                            _context11.next = 36;
                            return Promise.all(updatePromises);

                        case 36:
                        case "end":
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        function combineDuplicateHistories(_x13) {
            return _ref12.apply(this, arguments);
        }

        return combineDuplicateHistories;
    }();

    return ImageDataAccess;
}();

function getImageHash(imageProperties) {
    if (!imageProperties) {
        return null;
    }

    var identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime || imageProperties.fileModifyDate,
        camera: imageProperties.camera,
        pixels: imageProperties.pixelCount,
        number: imageProperties.imageNumber
    };

    return (0, _md2.default)(JSON.stringify(identifiers));
}