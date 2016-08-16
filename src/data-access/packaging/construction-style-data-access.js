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
            , f_pl.FormulaText as pieceLengthFormulaText
            , f_pw.FormulaText as pieceWidthFormulaText
            , f_lsa.FormulaText as lengthwiseScoringAllowanceFormulaText
            , f_wsa.FormulaText as widthwiseScoringAllowanceFormulaText
            , cs.UpdateVersion as updateVersion
from        ConstructionStyles as cs
left join   Formulas as f_pl on f_pl.FormulaId = cs.PieceLengthFormulaId
left join   Formulas as f_pw on f_pw.FormulaId = cs.PieceWidthFormulaId
left join   Formulas as f_lsa on f_lsa.FormulaId = cs.LengthwiseScoringAllowanceFormulaId
left join   Formulas as f_wsa on f_wsa.FormulaId = cs.WidthwiseScoringAllowanceFormulaId
where       cs.ConstructionStyleId = ?
`;

const detailVariablesSql = `
select      fv.VariableIndex as variableIndex
            , fv.VariableIdentifier as variableIdentifier
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
