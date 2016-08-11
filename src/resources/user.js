import {listUsers, addUser, findUser, updateUser, deleteUser} from "../data-access/user";

export async function list(ctx) {
    ctx.body = listUsers();
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
    let user = findUser(ctx.params.id);
    if (!user) {
        ctx.status = 404;
        return;
    }

    deleteUser(user._id);
    ctx.status = 200;
}
