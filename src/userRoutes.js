
export function *add() {

}
/*
export function *get(id) {
	this.body = "You passed me: " + id;
}
*/
export async function get(ctx) {
	ctx.body = `You passed me ${ctx.params.id}`;
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
