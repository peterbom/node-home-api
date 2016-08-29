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
            console.log(err);
        }
    });
});