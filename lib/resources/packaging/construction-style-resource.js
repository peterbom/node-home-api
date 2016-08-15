"use strict";

exports.__esModule = true;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConstructionStyleResource = exports.ConstructionStyleResource = function () {
    function ConstructionStyleResource(dataAccess) {
        _classCallCheck(this, ConstructionStyleResource);

        if (dataAccess === undefined) {
            throw new Error("dataAccess not defined");
        }

        this._dataAccess = dataAccess;
    }

    ConstructionStyleResource.prototype.list = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return this._dataAccess.getAll();

                        case 2:
                            ctx.body = _context.sent;

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function list(_x) {
            return _ref.apply(this, arguments);
        }

        return list;
    }();

    ConstructionStyleResource.prototype.get = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
            var id, detail;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            id = Number.parseInt(ctx.params.id);

                            if (!Number.isNaN(id)) {
                                _context2.next = 4;
                                break;
                            }

                            ctx.status = 400;
                            return _context2.abrupt("return");

                        case 4:
                            _context2.next = 6;
                            return this._dataAccess.getDetail(id);

                        case 6:
                            detail = _context2.sent;

                            if (detail) {
                                _context2.next = 10;
                                break;
                            }

                            ctx.status = 404;
                            return _context2.abrupt("return");

                        case 10:

                            ctx.body = detail;

                        case 11:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function get(_x2) {
            return _ref2.apply(this, arguments);
        }

        return get;
    }();

    return ConstructionStyleResource;
}();