"use strict";

exports.__esModule = true;
exports.PhotoImageDataAccess = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoImageDataAccess = exports.PhotoImageDataAccess = function () {
    function PhotoImageDataAccess(dbManager) {
        _classCallCheck(this, PhotoImageDataAccess);

        this._photoImages = dbManager.get("photoImages");
        this._photoImages.ensureIndex({ "directoryPath": 1, "filename": 1 });
        this._photoImages.ensureIndex({ "hash": 1 });
        this._photoImages.ensureIndex({ "properties.takenDateTime": 1 });
    }

    PhotoImageDataAccess.prototype.getIds = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var includeInvalid = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var includeUnreadable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var includeUndated = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var criteria, results;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            criteria = {};

                            if (!includeInvalid) {
                                criteria.valid = true;
                            }

                            if (!includeUnreadable) {
                                criteria.properties = { $ne: null };
                            }

                            if (!includeUndated) {
                                criteria["properties.takenDateTime"] = { $ne: null };
                            }

                            _context.next = 6;
                            return this._photoImages.find(criteria, { fields: { _id: 1 } });

                        case 6:
                            results = _context.sent;
                            return _context.abrupt("return", results.map(function (r) {
                                return r._id;
                            }));

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getIds(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return getIds;
    }();

    PhotoImageDataAccess.prototype.getById = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._photoImages.findOne({ _id: id });

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function getById(_x7) {
            return _ref2.apply(this, arguments);
        }

        return getById;
    }();

    PhotoImageDataAccess.prototype.getByIds = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ids) {
            var includeInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var criteria;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            criteria = { _id: { $in: ids } };

                            if (!includeInvalid) {
                                criteria.valid = true;
                            }

                            _context3.next = 4;
                            return this._photoImages.find(criteria);

                        case 4:
                            return _context3.abrupt("return", _context3.sent);

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function getByIds(_x8, _x9) {
            return _ref3.apply(this, arguments);
        }

        return getByIds;
    }();

    PhotoImageDataAccess.prototype.getByHash = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(hash) {
            var includeInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var criteria;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            criteria = { hash: hash };

                            if (!includeInvalid) {
                                criteria.valid = true;
                            }

                            _context4.next = 4;
                            return this._photoImages.find(criteria);

                        case 4:
                            return _context4.abrupt("return", _context4.sent);

                        case 5:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function getByHash(_x11, _x12) {
            return _ref4.apply(this, arguments);
        }

        return getByHash;
    }();

    PhotoImageDataAccess.prototype.getByPath = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(directoryPath) {
            var includeInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var criteria;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            criteria = { directoryPath: directoryPath };

                            if (!includeInvalid) {
                                criteria.valid = true;
                            }

                            _context5.next = 4;
                            return this._photoImages.find(criteria);

                        case 4:
                            return _context5.abrupt("return", _context5.sent);

                        case 5:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function getByPath(_x14, _x15) {
            return _ref5.apply(this, arguments);
        }

        return getByPath;
    }();

    PhotoImageDataAccess.prototype.findUnreadable = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return this._photoImages.find({ properties: null, valid: true });

                        case 2:
                            return _context6.abrupt("return", _context6.sent);

                        case 3:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function findUnreadable() {
            return _ref6.apply(this, arguments);
        }

        return findUnreadable;
    }();

    PhotoImageDataAccess.prototype.findMissingTakenDate = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.next = 2;
                            return this._photoImages.find({
                                properties: { $ne: null },
                                "properties.takenDateTime": null,
                                valid: true
                            });

                        case 2:
                            return _context7.abrupt("return", _context7.sent);

                        case 3:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function findMissingTakenDate() {
            return _ref7.apply(this, arguments);
        }

        return findMissingTakenDate;
    }();

    PhotoImageDataAccess.prototype.getDiff = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(directoryPath, filenames) {
            var indexedResults, result, filenameLookup, indexedFilenameLookup, filename, _filename;

            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return this._photoImages.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 2:
                            indexedResults = _context8.sent;
                            result = {
                                new: [],
                                deleted: []
                            };

                            if (!(indexedResults.length === 0)) {
                                _context8.next = 7;
                                break;
                            }

                            result.new = filenames;
                            return _context8.abrupt("return", result);

                        case 7:
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

                            return _context8.abrupt("return", result);

                        case 14:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function getDiff(_x17, _x18) {
            return _ref8.apply(this, arguments);
        }

        return getDiff;
    }();

    PhotoImageDataAccess.prototype.getIndexedDirectories = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
            var groups;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.next = 2;
                            return this._photoImages.aggregate({ $group: { _id: "$directoryPath", count: { $sum: 1 } } });

                        case 2:
                            groups = _context9.sent;
                            return _context9.abrupt("return", groups.map(function (g) {
                                return {
                                    directoryPath: g._id,
                                    imageCount: g.count
                                };
                            }));

                        case 4:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function getIndexedDirectories() {
            return _ref9.apply(this, arguments);
        }

        return getIndexedDirectories;
    }();

    PhotoImageDataAccess.prototype.cleanExcept = function () {
        var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(directoryPath, filenames) {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return this._photoImages.remove({ directoryPath: directoryPath, filename: { $nin: filenames } });

                        case 2:
                        case "end":
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function cleanExcept(_x19, _x20) {
            return _ref10.apply(this, arguments);
        }

        return cleanExcept;
    }();

    PhotoImageDataAccess.prototype.cleanIds = function () {
        var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(ids) {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.next = 2;
                            return this._photoImages.remove({ _id: { $in: ids } });

                        case 2:
                        case "end":
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        function cleanIds(_x21) {
            return _ref11.apply(this, arguments);
        }

        return cleanIds;
    }();

    PhotoImageDataAccess.prototype.invalidateImageIds = function () {
        var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(ids) {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _context12.next = 2;
                            return this._photoImages.update({ _id: { $in: ids } }, { $set: { valid: false } }, { multi: true });

                        case 2:
                        case "end":
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        function invalidateImageIds(_x22) {
            return _ref12.apply(this, arguments);
        }

        return invalidateImageIds;
    }();

    PhotoImageDataAccess.prototype.invalidateImage = function () {
        var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(directoryPath, filename) {
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            _context13.next = 2;
                            return this._photoImages.update({ directoryPath: directoryPath, filename: filename }, { $set: { valid: false } });

                        case 2:
                        case "end":
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        function invalidateImage(_x23, _x24) {
            return _ref13.apply(this, arguments);
        }

        return invalidateImage;
    }();

    PhotoImageDataAccess.prototype.invalidateImages = function () {
        var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(directoryPath) {
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            _context14.next = 2;
                            return this._photoImages.update({ directoryPath: directoryPath }, { $set: { valid: false } }, { multi: true });

                        case 2:
                        case "end":
                            return _context14.stop();
                    }
                }
            }, _callee14, this);
        }));

        function invalidateImages(_x25) {
            return _ref14.apply(this, arguments);
        }

        return invalidateImages;
    }();

    PhotoImageDataAccess.prototype.upsertImage = function () {
        var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(directoryPath, filename, imageProperties /* Can be null */) {
            var image;
            return regeneratorRuntime.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            image = {
                                directoryPath: directoryPath,
                                filename: filename,
                                hash: getImageHash(imageProperties),
                                properties: imageProperties,
                                valid: true
                            };
                            _context15.next = 3;
                            return this._photoImages.findOneAndUpdate({ directoryPath: directoryPath, filename: filename }, { $set: image }, { upsert: true });

                        case 3:
                            image = _context15.sent;

                            if (!(!image.pathHistory && imageProperties)) {
                                _context15.next = 9;
                                break;
                            }

                            image.pathHistory = [{
                                date: imageProperties.fileCreateDate,
                                filePath: _path2.default.join(directoryPath, filename)
                            }];

                            _context15.next = 8;
                            return this._photoImages.update({ _id: image._id }, image);

                        case 8:
                            image = _context15.sent;

                        case 9:
                        case "end":
                            return _context15.stop();
                    }
                }
            }, _callee15, this);
        }));

        function upsertImage(_x26, _x27, _x28) {
            return _ref15.apply(this, arguments);
        }

        return upsertImage;
    }();

    PhotoImageDataAccess.prototype.updateLocation = function () {
        var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(id, directoryPath, filename) {
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            _context16.next = 2;
                            return this._photoImages.update({ _id: id }, { $set: { directoryPath: directoryPath, filename: filename } });

                        case 2:
                        case "end":
                            return _context16.stop();
                    }
                }
            }, _callee16, this);
        }));

        function updateLocation(_x29, _x30, _x31) {
            return _ref16.apply(this, arguments);
        }

        return updateLocation;
    }();

    PhotoImageDataAccess.prototype.listDuplicateHashes = function () {
        var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17() {
            var groups;
            return regeneratorRuntime.wrap(function _callee17$(_context17) {
                while (1) {
                    switch (_context17.prev = _context17.next) {
                        case 0:
                            _context17.next = 2;
                            return this._photoImages.aggregate([{ $match: { hash: { $ne: null } } }, { $group: { _id: "$hash", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $sort: { count: -1 } }]);

                        case 2:
                            groups = _context17.sent;
                            return _context17.abrupt("return", groups.map(function (group) {
                                return group._id;
                            }));

                        case 4:
                        case "end":
                            return _context17.stop();
                    }
                }
            }, _callee17, this);
        }));

        function listDuplicateHashes() {
            return _ref17.apply(this, arguments);
        }

        return listDuplicateHashes;
    }();

    PhotoImageDataAccess.prototype.combineDuplicateHistories = function () {
        var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(ids) {
            var _this = this;

            var duplicates, hash, allPathHistoryEvents, uniquePathHistoryEvents, lastEvent, _iterator, _isArray, _i, _ref19, pathHistoryEvent, updatePromises, _loop, _iterator2, _isArray2, _i2, _ref20, _ret;

            return regeneratorRuntime.wrap(function _callee18$(_context18) {
                while (1) {
                    switch (_context18.prev = _context18.next) {
                        case 0:
                            _context18.next = 2;
                            return this._photoImages.find({ _id: { $in: ids } });

                        case 2:
                            duplicates = _context18.sent;

                            if (!(duplicates.length < 2)) {
                                _context18.next = 5;
                                break;
                            }

                            return _context18.abrupt("return");

                        case 5:
                            hash = duplicates[0].hash;

                            if (!duplicates.some(function (d) {
                                return d.hash !== hash;
                            })) {
                                _context18.next = 8;
                                break;
                            }

                            throw new Error("Expect all duplicates to have the same hash");

                        case 8:

                            // Merge all the pathHistories together and order by date
                            allPathHistoryEvents = duplicates.map(function (img) {
                                return img.pathHistory;
                            }).reduce(function (history1, history2) {
                                return history1.concat(history2);
                            }, []).sort(function (event1, event2) {
                                return event1.date - event2.date;
                            });

                            // Remove duplicates (including events where the path is unchanged)

                            uniquePathHistoryEvents = [];
                            lastEvent = null;
                            _iterator = uniquePathHistoryEvents, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 12:
                            if (!_isArray) {
                                _context18.next = 18;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context18.next = 15;
                                break;
                            }

                            return _context18.abrupt("break", 26);

                        case 15:
                            _ref19 = _iterator[_i++];
                            _context18.next = 22;
                            break;

                        case 18:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context18.next = 21;
                                break;
                            }

                            return _context18.abrupt("break", 26);

                        case 21:
                            _ref19 = _i.value;

                        case 22:
                            pathHistoryEvent = _ref19;

                            if (!lastEvent || lastEvent.path !== pathHistoryEvent.path) {
                                uniquePathHistoryEvents.push(pathHistoryEvent);
                                lastEvent = pathHistoryEvent;
                            }

                        case 24:
                            _context18.next = 12;
                            break;

                        case 26:

                            // For each duplicate, the path history includes all events up to and including
                            // the current latest date
                            updatePromises = [];

                            _loop = function _loop() {
                                if (_isArray2) {
                                    if (_i2 >= _iterator2.length) return "break";
                                    _ref20 = _iterator2[_i2++];
                                } else {
                                    _i2 = _iterator2.next();
                                    if (_i2.done) return "break";
                                    _ref20 = _i2.value;
                                }

                                var duplicate = _ref20;

                                var latestDate = duplicate.pathHistory[duplicate.pathHistory.length - 1].date;
                                duplicate.pathHistory = uniquePathHistoryEvents.filter(function (event) {
                                    return event.date <= latestDate;
                                });

                                updatePromises.push(_this._photoImages.update({ _id: duplicate._id }, duplicate));
                            };

                            _iterator2 = duplicates, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 29:
                            _ret = _loop();

                            if (!(_ret === "break")) {
                                _context18.next = 32;
                                break;
                            }

                            return _context18.abrupt("break", 34);

                        case 32:
                            _context18.next = 29;
                            break;

                        case 34:
                            _context18.next = 36;
                            return Promise.all(updatePromises);

                        case 36:
                        case "end":
                            return _context18.stop();
                    }
                }
            }, _callee18, this);
        }));

        function combineDuplicateHistories(_x32) {
            return _ref18.apply(this, arguments);
        }

        return combineDuplicateHistories;
    }();

    return PhotoImageDataAccess;
}();

function getImageHash(imageProperties) {
    if (!imageProperties) {
        return null;
    }

    if (!imageProperties.takenDateTime) {
        return null;
    }

    var identifiers = {
        type: imageProperties.fileType,
        date: imageProperties.takenDateTime,
        camera: imageProperties.camera,
        pixels: imageProperties.pixelCount,
        number: imageProperties.imageNumber
    };

    return (0, _md2.default)(JSON.stringify(identifiers));
}