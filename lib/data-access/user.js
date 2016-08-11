"use strict";

exports.__esModule = true;
exports.findUser = findUser;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.clearUsers = clearUsers;
exports.listUsers = listUsers;
var users = [];
var newUserId = 1;

function findUser(idVal) {
	var id = Number.parseInt(idVal);
	if (id === NaN) {
		return null;
	}

	return users.find(function (u) {
		return u._id === id;
	});
}

function addUser(userData) {
	var userObject = Object.assign({ _id: newUserId++ }, userData);
	users.push(userObject);

	return userObject;
}

function updateUser(id, newUserData) {
	var index = users.findIndex(function (u) {
		return u._id === id;
	});
	if (index === -1) {
		throw new RangeError("Users collection does not contain an item with id " + id);
	}

	var newUser = Object.assign({ _id: id }, newUserData);
	users.splice(index, 1, newUser);

	return newUser;
}

function deleteUser(id) {
	var index = users.findIndex(function (u) {
		return u._id === id;
	});
	if (index === -1) {
		throw new RangeError("Users collection does not contain an item with id " + id);
	}

	users.splice(index, 1);
}

function clearUsers() {
	users = [];
}

function listUsers() {
	return users;
}