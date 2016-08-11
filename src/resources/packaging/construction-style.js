import {getAll} from "../../data-access/packaging/construction-style-data-access";

export async function list (ctx) {
    ctx.body = await getAll();
}
