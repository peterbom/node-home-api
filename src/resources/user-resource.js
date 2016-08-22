
export class UserResource {
    constructor (userDataAccess) {
        if (userDataAccess === undefined) {
            throw new Error("userDataAccess not defined");
        }

        this._userDataAccess = userDataAccess;
    }

    async list(ctx) {
        ctx.body = await this._userDataAccess.listUsers();
    }

    async add(ctx) {
        let insertedUser = await this._userDataAccess.upsertUser(ctx.request.body);

        ctx.set("location", `/user/${insertedUser.sub}`);
        ctx.status = 201;
    }

    async get(ctx) {
        let user = await this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        ctx.body = user;
    }

    async update(ctx) {
        let user = await this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        let updatedUser = await this._userDataAccess.updateUser(user.sub, ctx.request.body);

        ctx.body = updatedUser;
        ctx.set("location", `/user/${updatedUser.sub}`);

        // http://blog.ploeh.dk/2013/04/30/rest-lesson-learned-avoid-204-responses/
        ctx.status = 200;
    }

    async remove(ctx) {
        let user = await this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        await this._userDataAccess.deleteUser(user._id);
        ctx.status = 200;
    }
}
