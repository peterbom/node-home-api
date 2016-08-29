"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StagingPhotoDataAccess = exports.StagingPhotoDataAccess = function () {
    function StagingPhotoDataAccess(fileFinder, stagingPhotoPath) {
        _classCallCheck(this, StagingPhotoDataAccess);

        this._fileFinder = fileFinder;
        this._stagingPhotoPath = stagingPhotoPath;
    }

    StagingPhotoDataAccess.prototype.getAllFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var files, directories, directoryLookup;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._fileFinder.find(this._stagingPhotoPath, /^(?!.*\.db$)/, [/.*\/@.*/, /.*\.db/]);

                        case 2:
                            files = _context.sent;
                            directories = [];
                            directoryLookup = {};

                            files.forEach(function (file) {
                                var directory = directoryLookup[file.path];

                                if (!directory) {
                                    directory = {
                                        path: file.path,
                                        files: []
                                    };

                                    directories.push(directory);
                                    directoryLookup[file.path] = directory;
                                }

                                directory.files.push(file.filename);
                            });

                            return _context.abrupt("return", directories);

                        case 7:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getAllFiles() {
            return _ref.apply(this, arguments);
        }

        return getAllFiles;
    }();

    return StagingPhotoDataAccess;
}();