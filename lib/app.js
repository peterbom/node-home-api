"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = undefined;

require("babel-polyfill");

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaConvert = require("koa-convert");

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var app = exports.app = new _koa2.default();

// https://github.com/koajs/koa/wiki/Error-Handling
app.use(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 10;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);

            // https://developer.mozilla.org/en-US/docs/Web/API/Console/trace
            console.trace(_context.t0);

            ctx.status = _context.t0.status || 500;
            ctx.app.emit('error', _context.t0, ctx);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 5]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// https://github.com/koajs/bodyparser
app.use((0, _koaBodyparser2.default)({
  enableTypes: ["json"],
  // http://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data
  onerror: function onerror(err, ctx) {
    return ctx.throw('invalid syntax', 400);
  }
}));

var userRoutes = require("./userRoutes");
var userRouteMiddleware = (0, _koaSimpleRouter2.default)(function (_) {
  _.get('/user/:id', userRoutes.get);
  _.post('/user', userRoutes.add);
  _.put('/user/:id', userRoutes.update);
  _.delete('/user/:id', userRoutes.remove);
});

app.use(userRouteMiddleware);

/*
// TODO: remove
//app.use(routes.post("/user", userRoutes.add));
app.use(routes.get("/user/:id", userRoutes.get));
//app.use(routes.put("/user/:id", userRoutes.update));
//app.use(routes.del("/user/:id", userRoutes.remove));
*/

/*
// Old:
// Get directories (from photoController.getPhotoPage)
// Get filenames in a given directory (from photoController.getPhotoPage)
// Get photo properties for a given directory (from photoController.getDirectoryData)
// Get photo tags for a given directory+filename (from photoController.getPhotoData)
// Create a file movement given a directory+filename and takenDateTime+camera (from photoController.moveFiles)

// New:
// Get all staging photo file paths (GET /staging-photo)
// Get photo properties and tags for a given file path (GET /staging-photo/:id)
// Create a file movement given a file path and takenDateTime+camera (PUT /photo-movement/:id)
let photoRoutes = require("./photoRoutes");
app.use(routes.get("/staging-photo", photoRoutes.listStagingPhotos));
app.use(routes.get("/staging-photo/:id", photoRoutes.getStagingPhoto));
app.use(routes.put("/photo-movement/:id", photoRoutes.createPhotoMovement));
*/

var port = process.env.PORT || process.argv[2] || 3000;

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
  app.listen(port);
  console.log("Application started. Listening on port: " + port);
}