"use strict";

exports.__esModule = true;
exports.authenticationRouter = exports.photoMovementRouter = exports.stagingPhotoRouter = exports.userRouter = undefined;

var _koaSimpleRouter = require("koa-simple-router");

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _user = require("./resources/user");

var userResource = _interopRequireWildcard(_user);

var _stagingPhoto = require("./resources/staging-photo");

var stagingPhotoResource = _interopRequireWildcard(_stagingPhoto);

var _photoMovement = require("./resources/photo-movement");

var photoMovementResource = _interopRequireWildcard(_photoMovement);

var _authentication = require("./resources/authentication");

var authenticationResource = _interopRequireWildcard(_authentication);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRouter = exports.userRouter = (0, _koaSimpleRouter2.default)(function (_) {
    _.get('/user/:id', userResource.get);
    _.post('/user', userResource.add);
    _.put('/user/:id', userResource.update);
    _.delete('/user/:id', userResource.remove);
});

var stagingPhotoRouter = exports.stagingPhotoRouter = (0, _koaSimpleRouter2.default)(function (_) {
    _.get("/staging-photo", stagingPhotoResource.list);
    _.get("/staging-photo/:id", stagingPhotoResource.get);
});

var photoMovementRouter = exports.photoMovementRouter = (0, _koaSimpleRouter2.default)(function (_) {
    _.put("/photo-movement/:id", photoMovementResource.move);
});

var authenticationRouter = exports.authenticationRouter = (0, _koaSimpleRouter2.default)(function (_) {
    _.post("/authentication", authenticationResource.authenticate);
});