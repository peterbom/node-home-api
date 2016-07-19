
//import monk from "monk";

//let db = monk("localhost/usersApi");

let users = []; //db.get("users");
let id = 1;

export function findUser(idVal) {
	let id = Number.parseInt(idVal);
	if (id === NaN) {
		return null;
	}

	return users.find(u => u._id === id);
}

export function addUser(userData) {
	let userObject = Object.assign({_id: id++}, userData);
	users.push(userObject);

	return userObject;
}

export function clearUsers() {
	users = [];
}

export async function add(ctx) {
	// TODO: validation
	let insertedUser = addUser(ctx.body);

	ctx.set("location", `/user/${insertedUser._id}`);
	ctx.status = 200;
}

export async function get(ctx) {
	let user = findUser(ctx.params.id);
	if (!user) {
		ctx.status = 404;
		return;
	}

	ctx.body = user;
}

export function *update(id) {

}

export function *remove(id) {

}

/*
export async function myFunc() {
	this.body = "Yeah";
}
*/
