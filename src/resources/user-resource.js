
export class UserResource {
    constructor (userDataAccess) {
        if (userDataAccess === undefined) {
            throw new Error("userDataAccess not defined");
        }

        this._userDataAccess = userDataAccess;
    }

    list(ctx) {
        ctx.body = this._userDataAccess.listUsers();
    }

    async add(ctx) {
        // TODO: validation
        let insertedUser = this._userDataAccess.addUser(ctx.request.body);

        ctx.set("location", `/user/${insertedUser._id}`);
        ctx.status = 201;
    }

    async get(ctx) {
        let user = this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        ctx.body = user;
    }

    async update(ctx) {
        let user = this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        // TODO: validation
        let updatedUser = this._userDataAccess.updateUser(user._id, ctx.request.body);

        ctx.body = updatedUser;
        ctx.set("location", `/user/${updatedUser._id}`);

        // http://blog.ploeh.dk/2013/04/30/rest-lesson-learned-avoid-204-responses/
        ctx.status = 200;
    }

    async remove(ctx) {
        let user = this._userDataAccess.findUser(ctx.params.id);
        if (!user) {
            ctx.status = 404;
            return;
        }

        this._userDataAccess.deleteUser(user._id);
        ctx.status = 200;
    }
}
