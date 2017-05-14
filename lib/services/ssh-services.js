"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeSsh = require("node-ssh");

var MaxConnectionAgeMinutes = 10;

var SshServices = function () {
    function SshServices(host, port, username, privateKeyPath, localRoot, serverRoot) {
        _classCallCheck(this, SshServices);

        // https://www.npmjs.com/package/node-ssh
        this._ssh = new NodeSsh();
        this._host = host;
        this._port = port;
        this._username = username;
        this._privateKeyPath = privateKeyPath;
        this._localRootRegex = new RegExp("^" + localRoot);
        this._serverRoot = serverRoot;

        this._connectionExpires = null;
    }

    SshServices.prototype.moveServerFiles = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(localSourcePath, localDestinationPath) {
            var serverSourcePath, serverDestinationPath;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            serverSourcePath = localSourcePath.replace(this._localRootRegex, this._serverRoot);
                            serverDestinationPath = localDestinationPath.replace(this._localRootRegex, this._serverRoot);
                            _context.next = 4;
                            return this._connect();

                        case 4:
                            _context.next = 6;
                            return this._ssh.exec("mv", [serverSourcePath, serverDestinationPath]);

                        case 6:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function moveServerFiles(_x, _x2) {
            return _ref.apply(this, arguments);
        }

        return moveServerFiles;
    }();

    SshServices.prototype._connect = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!this._connectionExpires) {
                                _context2.next = 4;
                                break;
                            }

                            if (!(this._connectionExpires > new Date())) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt("return");

                        case 3:

                            // Current connection expired. Close it.
                            this._ssh.dispose();

                        case 4:
                            _context2.next = 6;
                            return this._ssh.connect({
                                host: this._host,
                                port: this._port,
                                username: this._username,
                                privateKey: this._privateKeyPath
                            });

                        case 6:

                            this._connectionExpires = new Date(new Date().getTime() + MaxConnectionAgeMinutes * 60 * 1000);

                        case 7:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function _connect() {
            return _ref2.apply(this, arguments);
        }

        return _connect;
    }();

    return SshServices;
}();

module.exports = exports = SshServices;