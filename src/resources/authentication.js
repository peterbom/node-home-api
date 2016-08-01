import {validateIdToken} from "../oidc/id-token-validator";

export async function authenticate(ctx) {
	let body = ctx.request.body;
	let idToken = body.id_token || body["#id_token"];

	try {
		await validateIdToken(idToken);
		ctx.status = 200;
	} catch (err) {
		console.trace(err);
		ctx.status = 400;
	}
}