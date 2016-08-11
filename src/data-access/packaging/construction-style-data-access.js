import {appSettings} from "../../globals";
import {Database} from "../odbc-promise";

let _db;

function getDb() {
    if (!_db) {
        _db = (appSettings.databaseFactory && appSettings.databaseFactory()) || new Database();
    }

    return _db;
}

export async function getAll () {
    await getDb().open(appSettings.packagingConnectionString);
    try {
        return await getDb().query("select * from ConstructionStyles");
    } finally {
        await getDb().close();
    }
}
