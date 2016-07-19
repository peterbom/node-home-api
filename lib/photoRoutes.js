/*
var parse = require("co-body");

module.exports.listStagingPhotos = function *() {
	this.body = "I'm listed";
};

module.exports.getStagingPhoto = function *(id) {
	this.body = "Getting " + id;
};

module.exports.createPhotoMovement = function *(id) {
	var metadata = yield parse(this);

	// If we want to set the location header:
	// this.set("location", "/resource/" + id);
	this.status = 200;
};

*/
"use strict";