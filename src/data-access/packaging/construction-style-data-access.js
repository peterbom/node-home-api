import {Database} from "../odbc-database";

const listSql = `
select      ConstructionStyleId as id
            , FefcoEsboCode as fefcoEsboCode
            , Name as name
from        ConstructionStyles
`;

const detailSql = `
select      cs.ConstructionStyleId as id
            , cs.FefcoEsboCode as fefcoEsboCode
            , cs.Name as name
            , f.FormulaText as formulaText
            , cs.UpdateVersion as updateVersion
from        ConstructionStyles as cs
inner join  Formulas as f on f.FormulaId = cs.PieceLengthFormulaId
where       cs.ConstructionStyleId = ?
`;

const detailVariablesSql = `
select      fv.VariableIndex as variableIndex
            , fv.VariableIdentifier as variableName
            , coalesce(fv.PropertyName, ep.PropertyName) as propertyName
            , ep.EntityCode as entityCode
from        ConstructionStyles as cs
inner join  FormulaVariables as fv on fv.FormulaVariableSetId = cs.FormulaVariableSetId
left join   ExtraProperties as ep on ep.ExtraPropertyId = fv.ExtraPropertyId
where       cs.ConstructionStyleId = ?
`;

export class ConstructionStyleDataAccess {
    constructor (databaseFactory) {
        if (databaseFactory === undefined) {
            throw new Error("databaseFactory not defined");
        }

        this._getDb = () => databaseFactory && databaseFactory() || new Database();
    }

    async getAll () {
        return await this._getDb().withOpenConnection(db => db.query(listSql));
    }

    async getDetail (id) {
        let [details, variables] = await  this._getDb().withOpenConnection(db => Promise.all([
            db.query(detailSql, [id]),
            db.query(detailVariablesSql, [id])
        ]));

        let detail = details[0];
        detail.variables = variables;
        return detail;
    }
}
