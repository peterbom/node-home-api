"use strict";

exports.__esModule = true;
exports.PhotoImageDataAccess = undefined;

var _log = require("../shared/log");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhotoImageDataAccess = exports.PhotoImageDataAccess = function () {
    function PhotoImageDataAccess(dbManager, imageUtils) {
        _classCallCheck(this, PhotoImageDataAccess);

        this._dbManager = dbManager;
        this._imageUtils = imageUtils;

        this._photoImages = dbManager.get("photoImages");
        this._photoImages.ensureIndex({ "directoryPath": 1, "filename": 1 });
        this._photoImages.ensureIndex({ "hash": 1 });
        this._photoImages.ensureIndex({ "requiresMovement": 1 });
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
            var objectId;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            objectId = this._dbManager.id(id);
                            _context2.next = 3;
                            return this._photoImages.findOne({ _id: objectId });

                        case 3:
                            return _context2.abrupt("return", _context2.sent);

                        case 4:
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
            var _this = this;

            var includeInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var objectIds, criteria;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            objectIds = ids.map(function (id) {
                                return _this._dbManager.id(id);
                            });
                            criteria = { _id: { $in: objectIds } };

                            if (!includeInvalid) {
                                criteria.valid = true;
                            }

                            _context3.next = 5;
                            return this._photoImages.find(criteria);

                        case 5:
                            return _context3.abrupt("return", _context3.sent);

                        case 6:
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

    PhotoImageDataAccess.prototype.findByCriteria = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(criteria) {
            var queryCriteria, takenCriteria;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            queryCriteria = { properties: { $ne: null }, valid: true };


                            if (criteria.path) {
                                queryCriteria.directoryPath = criteria.path;
                            }

                            if (criteria.fromDateTime || criteria.toDateTime) {
                                takenCriteria = {};

                                if (criteria.fromDateTime) {
                                    takenCriteria.$gte = (0, _moment2.default)(criteria.fromDateTime).toDate();
                                }

                                if (criteria.toDateTime) {
                                    takenCriteria.$lt = (0, _moment2.default)(criteria.toDateTime).toDate();
                                }

                                queryCriteria["properties.takenDateTime"] = takenCriteria;
                            }

                            _context8.next = 5;
                            return this._photoImages.find(queryCriteria);

                        case 5:
                            return _context8.abrupt("return", _context8.sent);

                        case 6:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function findByCriteria(_x17) {
            return _ref8.apply(this, arguments);
        }

        return findByCriteria;
    }();

    PhotoImageDataAccess.prototype.getTotalCount = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.next = 2;
                            return this._photoImages.count();

                        case 2:
                            return _context9.abrupt("return", _context9.sent);

                        case 3:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function getTotalCount() {
            return _ref9.apply(this, arguments);
        }

        return getTotalCount;
    }();

    PhotoImageDataAccess.prototype.getRequiringMovementCount = function () {
        var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return this._photoImages.count({ requiresMovement: true });

                        case 2:
                            return _context10.abrupt("return", _context10.sent);

                        case 3:
                        case "end":
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function getRequiringMovementCount() {
            return _ref10.apply(this, arguments);
        }

        return getRequiringMovementCount;
    }();

    PhotoImageDataAccess.prototype.getReadableCount = function () {
        var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.next = 2;
                            return this._photoImages.count({ hash: { $ne: null } });

                        case 2:
                            return _context11.abrupt("return", _context11.sent);

                        case 3:
                        case "end":
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        function getReadableCount() {
            return _ref11.apply(this, arguments);
        }

        return getReadableCount;
    }();

    PhotoImageDataAccess.prototype.getYearlySummary = function () {
        var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
            var group;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            group = {
                                _id: { $year: "$properties.takenDateTime" },
                                count: { $sum: 1 }
                            };
                            _context12.next = 3;
                            return this._photoImages.aggregate([{ $match: { "properties.takenDateTime": { $ne: null } } }, { $group: group }, { $sort: { _id: 1 } }, { $project: { _id: 0, year: "$_id", count: 1 } }]);

                        case 3:
                            return _context12.abrupt("return", _context12.sent);

                        case 4:
                        case "end":
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        function getYearlySummary() {
            return _ref12.apply(this, arguments);
        }

        return getYearlySummary;
    }();

    PhotoImageDataAccess.prototype.findPathsRequiringMovement = function () {
        var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
            var group;
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            group = {
                                _id: "$directoryPath",
                                totalCount: { $sum: 1 },
                                movableCount: {
                                    $sum: {
                                        $cond: [{ $eq: ["$requiresMovement", true] }, 1, 0]
                                    }
                                }
                            };
                            _context13.next = 3;
                            return this._photoImages.aggregate([{ $group: group }, { $match: { movableCount: { $gt: 0 } } }, { $sort: { "_id": 1 } }, { $project: { _id: 0, directoryPath: "$_id", totalCount: 1, movableCount: 1 } }]);

                        case 3:
                            return _context13.abrupt("return", _context13.sent);

                        case 4:
                        case "end":
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        function findPathsRequiringMovement() {
            return _ref13.apply(this, arguments);
        }

        return findPathsRequiringMovement;
    }();

    PhotoImageDataAccess.prototype.findImagesRequiringMovement = function () {
        var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(directoryPath) {
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            _context14.next = 2;
                            return this._photoImages.find({
                                directoryPath: directoryPath,
                                requiresMovement: true,
                                valid: true
                            });

                        case 2:
                            return _context14.abrupt("return", _context14.sent);

                        case 3:
                        case "end":
                            return _context14.stop();
                    }
                }
            }, _callee14, this);
        }));

        function findImagesRequiringMovement(_x18) {
            return _ref14.apply(this, arguments);
        }

        return findImagesRequiringMovement;
    }();

    PhotoImageDataAccess.prototype.getDiff = function () {
        var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(directoryPath, filenames) {
            var indexedResults, result, filenameLookup, indexedFilenameLookup, filename, _filename;

            return regeneratorRuntime.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            _context15.next = 2;
                            return this._photoImages.find({ directoryPath: directoryPath, valid: true }, { filename: 1 });

                        case 2:
                            indexedResults = _context15.sent;
                            result = {
                                new: [],
                                deleted: []
                            };

                            if (!(indexedResults.length === 0)) {
                                _context15.next = 7;
                                break;
                            }

                            result.new = filenames;
                            return _context15.abrupt("return", result);

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

                            return _context15.abrupt("return", result);

                        case 14:
                        case "end":
                            return _context15.stop();
                    }
                }
            }, _callee15, this);
        }));

        function getDiff(_x19, _x20) {
            return _ref15.apply(this, arguments);
        }

        return getDiff;
    }();

    PhotoImageDataAccess.prototype.getIndexedDirectories = function () {
        var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            _context16.next = 2;
                            return this._photoImages.distinct("directoryPath");

                        case 2:
                            return _context16.abrupt("return", _context16.sent);

                        case 3:
                        case "end":
                            return _context16.stop();
                    }
                }
            }, _callee16, this);
        }));

        function getIndexedDirectories() {
            return _ref16.apply(this, arguments);
        }

        return getIndexedDirectories;
    }();

    PhotoImageDataAccess.prototype.cleanExcept = function () {
        var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(directoryPath, filenames) {
            return regeneratorRuntime.wrap(function _callee17$(_context17) {
                while (1) {
                    switch (_context17.prev = _context17.next) {
                        case 0:
                            _context17.next = 2;
                            return this._photoImages.remove({ directoryPath: directoryPath, filename: { $nin: filenames } });

                        case 2:
                        case "end":
                            return _context17.stop();
                    }
                }
            }, _callee17, this);
        }));

        function cleanExcept(_x21, _x22) {
            return _ref17.apply(this, arguments);
        }

        return cleanExcept;
    }();

    PhotoImageDataAccess.prototype.cleanIds = function () {
        var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(ids) {
            var _this2 = this;

            var objectIds;
            return regeneratorRuntime.wrap(function _callee18$(_context18) {
                while (1) {
                    switch (_context18.prev = _context18.next) {
                        case 0:
                            objectIds = ids.map(function (id) {
                                return _this2._dbManager.id(id);
                            });
                            _context18.next = 3;
                            return this._photoImages.remove({ _id: { $in: objectIds } });

                        case 3:
                        case "end":
                            return _context18.stop();
                    }
                }
            }, _callee18, this);
        }));

        function cleanIds(_x23) {
            return _ref18.apply(this, arguments);
        }

        return cleanIds;
    }();

    PhotoImageDataAccess.prototype.invalidateImageIds = function () {
        var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(ids) {
            var _this3 = this;

            var objectIds;
            return regeneratorRuntime.wrap(function _callee19$(_context19) {
                while (1) {
                    switch (_context19.prev = _context19.next) {
                        case 0:
                            objectIds = ids.map(function (id) {
                                return _this3._dbManager.id(id);
                            });
                            _context19.next = 3;
                            return this._photoImages.update({ _id: { $in: objectIds } }, { $set: { valid: false } }, { multi: true });

                        case 3:
                        case "end":
                            return _context19.stop();
                    }
                }
            }, _callee19, this);
        }));

        function invalidateImageIds(_x24) {
            return _ref19.apply(this, arguments);
        }

        return invalidateImageIds;
    }();

    PhotoImageDataAccess.prototype.invalidateImage = function () {
        var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(directoryPath, filename) {
            return regeneratorRuntime.wrap(function _callee20$(_context20) {
                while (1) {
                    switch (_context20.prev = _context20.next) {
                        case 0:
                            _context20.next = 2;
                            return this._photoImages.update({ directoryPath: directoryPath, filename: filename }, { $set: { valid: false } });

                        case 2:
                        case "end":
                            return _context20.stop();
                    }
                }
            }, _callee20, this);
        }));

        function invalidateImage(_x25, _x26) {
            return _ref20.apply(this, arguments);
        }

        return invalidateImage;
    }();

    PhotoImageDataAccess.prototype.invalidateImages = function () {
        var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(directoryPath) {
            return regeneratorRuntime.wrap(function _callee21$(_context21) {
                while (1) {
                    switch (_context21.prev = _context21.next) {
                        case 0:
                            _context21.next = 2;
                            return this._photoImages.update({ directoryPath: directoryPath }, { $set: { valid: false } }, { multi: true });

                        case 2:
                        case "end":
                            return _context21.stop();
                    }
                }
            }, _callee21, this);
        }));

        function invalidateImages(_x27) {
            return _ref21.apply(this, arguments);
        }

        return invalidateImages;
    }();

    PhotoImageDataAccess.prototype.upsertImage = function () {
        var _ref22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(directoryPath, filename, imageProperties /* Can be null */) {
            var image;
            return regeneratorRuntime.wrap(function _callee22$(_context22) {
                while (1) {
                    switch (_context22.prev = _context22.next) {
                        case 0:
                            image = {
                                directoryPath: directoryPath,
                                filename: filename,
                                hash: this._imageUtils.getImageHash(imageProperties),
                                properties: imageProperties,
                                requiresMovement: this._imageUtils.requiresMovement(directoryPath, filename, imageProperties),
                                valid: true
                            };
                            _context22.next = 3;
                            return this._photoImages.findOneAndUpdate({ directoryPath: directoryPath, filename: filename }, { $set: image }, { upsert: true });

                        case 3:
                            image = _context22.sent;

                            if (!(!image.pathHistory && imageProperties)) {
                                _context22.next = 9;
                                break;
                            }

                            image.pathHistory = [{
                                date: imageProperties.fileCreateDate,
                                filePath: _path2.default.join(directoryPath, filename)
                            }];

                            _context22.next = 8;
                            return this._photoImages.update({ _id: image._id }, image);

                        case 8:
                            image = _context22.sent;

                        case 9:
                        case "end":
                            return _context22.stop();
                    }
                }
            }, _callee22, this);
        }));

        function upsertImage(_x28, _x29, _x30) {
            return _ref22.apply(this, arguments);
        }

        return upsertImage;
    }();

    PhotoImageDataAccess.prototype.updateLocation = function () {
        var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee23(id, directoryPath, filename) {
            var objectId, image;
            return regeneratorRuntime.wrap(function _callee23$(_context23) {
                while (1) {
                    switch (_context23.prev = _context23.next) {
                        case 0:
                            objectId = this._dbManager.id(id);
                            _context23.next = 3;
                            return this._photoImages.findOne({ _id: objectId });

                        case 3:
                            image = _context23.sent;

                            if (image) {
                                _context23.next = 6;
                                break;
                            }

                            return _context23.abrupt("return");

                        case 6:

                            image.directoryPath = directoryPath;
                            image.filename = filename;
                            image.pathHistory.push({
                                date: new Date(),
                                filePath: _path2.default.join(directoryPath, filename)
                            });
                            image.requiresMovement = this._imageUtils.requiresMovement(directoryPath, filename, image.properties);

                            _context23.next = 12;
                            return this._photoImages.update({ _id: objectId }, image);

                        case 12:
                        case "end":
                            return _context23.stop();
                    }
                }
            }, _callee23, this);
        }));

        function updateLocation(_x31, _x32, _x33) {
            return _ref23.apply(this, arguments);
        }

        return updateLocation;
    }();

    PhotoImageDataAccess.prototype.listDuplicateHashes = function () {
        var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee24() {
            var groups;
            return regeneratorRuntime.wrap(function _callee24$(_context24) {
                while (1) {
                    switch (_context24.prev = _context24.next) {
                        case 0:
                            _context24.next = 2;
                            return this._photoImages.aggregate([{ $match: { hash: { $ne: null } } }, { $group: { _id: "$hash", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $sort: { count: -1 } }]);

                        case 2:
                            groups = _context24.sent;
                            return _context24.abrupt("return", groups.map(function (group) {
                                return group._id;
                            }));

                        case 4:
                        case "end":
                            return _context24.stop();
                    }
                }
            }, _callee24, this);
        }));

        function listDuplicateHashes() {
            return _ref24.apply(this, arguments);
        }

        return listDuplicateHashes;
    }();

    PhotoImageDataAccess.prototype.combineDuplicateHistories = function () {
        var _ref25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee25(ids) {
            var _this4 = this;

            var objectIds, duplicates, hash, allPathHistoryEvents, uniquePathHistoryEvents, lastEvent, _iterator, _isArray, _i, _ref26, pathHistoryEvent, updatePromises, _iterator2, _isArray2, _i2, _ref27, duplicate;

            return regeneratorRuntime.wrap(function _callee25$(_context25) {
                while (1) {
                    switch (_context25.prev = _context25.next) {
                        case 0:
                            objectIds = ids.map(function (id) {
                                return _this4._dbManager.id(id);
                            });
                            _context25.next = 3;
                            return this._photoImages.find({ _id: { $in: objectIds } });

                        case 3:
                            duplicates = _context25.sent;

                            if (!(duplicates.length < 2)) {
                                _context25.next = 6;
                                break;
                            }

                            return _context25.abrupt("return");

                        case 6:
                            hash = duplicates[0].hash;

                            if (!duplicates.some(function (d) {
                                return d.hash !== hash;
                            })) {
                                _context25.next = 9;
                                break;
                            }

                            throw new Error("Expect all duplicates to have the same hash");

                        case 9:

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
                            _iterator = allPathHistoryEvents, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                        case 13:
                            if (!_isArray) {
                                _context25.next = 19;
                                break;
                            }

                            if (!(_i >= _iterator.length)) {
                                _context25.next = 16;
                                break;
                            }

                            return _context25.abrupt("break", 27);

                        case 16:
                            _ref26 = _iterator[_i++];
                            _context25.next = 23;
                            break;

                        case 19:
                            _i = _iterator.next();

                            if (!_i.done) {
                                _context25.next = 22;
                                break;
                            }

                            return _context25.abrupt("break", 27);

                        case 22:
                            _ref26 = _i.value;

                        case 23:
                            pathHistoryEvent = _ref26;

                            if (!lastEvent || lastEvent.path !== pathHistoryEvent.path) {
                                uniquePathHistoryEvents.push(pathHistoryEvent);
                                lastEvent = pathHistoryEvent;
                            }

                        case 25:
                            _context25.next = 13;
                            break;

                        case 27:

                            // For each duplicate, the path history includes all events up to and including
                            // the current latest date
                            updatePromises = [];
                            _iterator2 = duplicates, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

                        case 29:
                            if (!_isArray2) {
                                _context25.next = 35;
                                break;
                            }

                            if (!(_i2 >= _iterator2.length)) {
                                _context25.next = 32;
                                break;
                            }

                            return _context25.abrupt("break", 43);

                        case 32:
                            _ref27 = _iterator2[_i2++];
                            _context25.next = 39;
                            break;

                        case 35:
                            _i2 = _iterator2.next();

                            if (!_i2.done) {
                                _context25.next = 38;
                                break;
                            }

                            return _context25.abrupt("break", 43);

                        case 38:
                            _ref27 = _i2.value;

                        case 39:
                            duplicate = _ref27;

                            if (duplicate.pathHistory && duplicate.pathHistory.length > 0) {
                                (function () {
                                    var latestDate = duplicate.pathHistory[duplicate.pathHistory.length - 1].date;
                                    duplicate.pathHistory = uniquePathHistoryEvents.filter(function (event) {
                                        return event.date <= latestDate;
                                    });

                                    updatePromises.push(_this4._photoImages.update({ _id: duplicate._id }, duplicate));
                                })();
                            }

                        case 41:
                            _context25.next = 29;
                            break;

                        case 43:
                            _context25.next = 45;
                            return Promise.all(updatePromises);

                        case 45:
                        case "end":
                            return _context25.stop();
                    }
                }
            }, _callee25, this);
        }));

        function combineDuplicateHistories(_x34) {
            return _ref25.apply(this, arguments);
        }

        return combineDuplicateHistories;
    }();

    return PhotoImageDataAccess;
}();