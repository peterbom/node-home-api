let users = [];
let newUserId = 1;

export function findUser(idVal) {
	let id = Number.parseInt(idVal);
	if (id === NaN) {
		return null;
	}

	return users.find(u => u._id === id);
}

export function addUser(userData) {
	let userObject = Object.assign({_id: newUserId++}, userData);
	users.push(userObject);

	return userObject;
}

export function updateUser(id, newUserData) {
	let index = users.findIndex(u => u._id === id);
	if (index === -1) {
		throw new RangeError(`Users collection does not contain an item with id ${id}`);
	}

	let newUser = Object.assign({_id: id}, newUserData);
	users.splice(index, 1, newUser);

	return newUser;
}

export function deleteUser(id) {
	let index = users.findIndex(u => u._id === id);
	if (index === -1) {
		throw new RangeError(`Users collection does not contain an item with id ${id}`);
	}

	users.splice(index, 1);
}

export function clearUsers() {
	users = [];
}