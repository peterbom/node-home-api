import router from "koa-simple-router";

import * as userResource from "./resources/user";
import * as stagingPhotoResource from "./resources/staging-photo";
import * as photoMovementResource from "./resources/photo-movement";
import * as authenticationResource from "./resources/authentication";

export let userRouter = router(_ => {
    _.get('/user/:id', userResource.get);
    _.post('/user', userResource.add);
    _.put('/user/:id', userResource.update);
    _.delete('/user/:id', userResource.remove);
});

export let stagingPhotoRouter = router(_ => {
    _.get("/staging-photo", stagingPhotoResource.list);
    _.get("/staging-photo/:id", stagingPhotoResource.get);
});

export let photoMovementRouter = router(_ => {
    _.put("/photo-movement/:id", photoMovementResource.move);
});

export let authenticationRouter = router(_ => {
	_.get("/authentication", authenticationResource.getProviders);
	_.post("/authentication", authenticationResource.authenticate);
})
