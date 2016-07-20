
//import monk from "monk";

//let db = monk("localhost/usersApi");

let users = []; //db.get("users");
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

export function clearUsers() {
	users = [];
}

export async function add(ctx) {
	// TODO: validation
	let insertedUser = addUser(ctx.request.body);

	ctx.set("location", `/user/${insertedUser._id}`);
	ctx.status = 201;
}

export async function get(ctx) {
	let user = findUser(ctx.params.id);
	if (!user) {
		ctx.status = 404;
		return;
	}

	ctx.body = user;
}

export async function update(ctx) {
	let user = findUser(ctx.params.id);
	if (!user) {
		ctx.status = 404;
		return;
	}

	// TODO: validation
	let updatedUser = updateUser(user._id, ctx.request.body);

	ctx.body = updatedUser;
	ctx.set("location", `/user/${updatedUser._id}`);

	// http://blog.ploeh.dk/2013/04/30/rest-lesson-learned-avoid-204-responses/
	ctx.status = 200;
}

export async function remove(ctx) {

}

/*
export async function myFunc() {
	this.body = "Yeah";
}
*/
