"use strict";

exports.__esModule = true;
exports.app = undefined;

require("babel-polyfill");

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _errorHandlingMiddleware = require("./error-handling-middleware");

var _requestProcessingMiddleware = require("./request-processing-middleware");

var _routingMiddleware = require("./routing-middleware");

var routers = _interopRequireWildcard(_routingMiddleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = exports.app = new _koa2.default();

app.use(_errorHandlingMiddleware.errorHandler);
app.use(_requestProcessingMiddleware.corsConfig);
app.use(_requestProcessingMiddleware.jsonBodyParser);

app.use(routers.userRouter);
app.use(routers.stagingPhotoRouter);
app.use(routers.photoMovementRouter);

var port = process.env.PORT || process.argv[2] || 3000;

// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
    app.listen(port);
    console.log("Application started. Listening on port: " + port);
}