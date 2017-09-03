const Log = require("../src/shared/log").Log;
const assert = require("assert");
const DbManager = require("monk");
const getDefaultComponents = require("../src/config").getDefaultComponents;
const {getTestEnvVars} = require("./utils/env-utils");

let envVars = getTestEnvVars();
let settings = {
    connectionString: envVars["TEST_CONNECTION_STRING"],
    authServer: "test.auth.com",
    authProviderSecret: "secret",
    machineLookup: {
        test: {
            macAddress: "11:11:11:11:11:11"
        },
        flash: {
            ipAddress: "127.0.0.1"
        }
    },
};

describe("Monk", function () {
    it ("can read inserted document", async done => {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            let thing = await things.insert({name: "Pete", type: "a"});

            assert(thing);
            assert(thing._id);

            done();

        } catch (err) {
            done(err);
        }
    });

    it ("can use distinct", async done => {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            await things.insert({name: "Pete", type: "a"});
            await things.insert({name: "pete", type: "a"});
            await things.insert({name: "pete", type: "b"});

            let names = await things.distinct("name");
            assert.equal(2, names.length);
            done();

        } catch (err) {
            done(err);
        }
    });

    it ("can use group by", async done => {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            await things.insert({name: "a"});
            await things.insert({name: "a"});
            await things.insert({name: "b"});

            let groups = await things.aggregate(
                {$group: {_id: "$name", count: {$sum: 1}}}
            );

            assert.equal(2, groups.length);
            let aGroup = groups.find(g => g._id == "a");
            let bGroup = groups.find(g => g._id == "b");

            assert.equal(2, aGroup.count);
            assert.equal(1, bGroup.count);

            done();

        } catch (err) {
            done(err);
        }
    });

    it ("can use group by, having count > 1", async done => {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            await things.insert({name: "a"});
            await things.insert({name: "a"});
            await things.insert({name: "b"});

            let groups = await things.aggregate([
                {$group: {_id: "$name", count: {$sum: 1}}},
                {$match: {count: {$gt: 1}}}
            ]);

            assert.equal(1, groups.length);
            assert.equal(2, groups[0].count);

            done();

        } catch (err) {
            done(err);
        }
    });

    it ("can upsert using findOneAndUpdate", async function (done) {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            await things.findOneAndUpdate({id: 1}, {
                $set: {
                    id: 1,
                    prop1: "a",
                    prop2: "b"
                }
            }, {upsert: true});

            let updated = await things.findOneAndUpdate({id: 1}, {
                $set: {
                    id: 1,
                    prop2: "c",
                    prop3: "d"
                }
            }, {upsert: true});

            assert.equal("a", updated.prop1);
            assert.equal("c", updated.prop2);
            assert.equal("d", updated.prop3);

            done();
        } catch (err) {
            done(err);
        }
    });

    it ("can search using 'in'", async function (done) {
        try {
            let components = getDefaultComponents(settings);
            let dbManager = new DbManager(components.appSettings.connectionString);

            let things = dbManager.get("things");
            await things.remove();

            await things.insert({name: "Pete", type: "a"});
            await things.insert({name: "pete", type: "a"});
            await things.insert({name: "pete", type: "b"});
            await things.insert({name: "John", type: "a"});
            await things.insert({name: "Jeff", type: "a"});
            await things.insert({name: "Bob", type: "a"});

            let matches = await things.find({name: {$in: ["pete", "john"]}, type: "a"});
            assert.equal(1, matches.length);

            done();
        } catch (err) {
            done(err);
        }
    });
});