import "babel-polyfill";

import assert from "assert";
import {default as DbManager} from "monk";
import {getDefaultComponents} from "../lib/config";

describe("Monk", function () {
    it ("Can upsert using findOneAndUpdate", async function (done) {
        try {
            let components = getDefaultComponents();
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

    it ("Can search using 'in'", async function (done) {
        try {
            let components = getDefaultComponents();
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