const db = require("../config/db");
const { splitKpKey, splitProjectKey } = require("../modifiers");

const { annexTableName: tableName } = require("./sqlTableNames");

class Annex {
  constructor({ kpKey, userId, annexNumber, annexNote, docsArray, budget }) {
    this.user = userId;
    this.kp = kpKey;
    this.annextName = annexNumber;
    this.note = annexNote;
    this.docsArray = docsArray;
    this.budget = budget;
  }

  static baseQueries = {
    selectAnnex: `SELECT
                LB_APP_KP_ID as 'annexId',
                LB_NAME_APP_KP as 'annexNumber',
                LB_NOTE as 'annexNote',
                LB_APP_KP_AMOUNT as 'budget',
                LB_PATH_APP_KP as 'docsArray'
                FROM ${tableName}`,
    selectArray: `SELECT
                LB_APP_KP_ID as 'annexId',
                LB_NAME_APP_KP as 'annexNumber',
                LB_NOTE as 'annexNote',
                LB_APP_KP_AMOUNT as 'budget',
                LB_PATH_APP_KP as 'docsArray'
                FROM ${tableName}`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForProject(key) {
    const { projectIn, client } = splitProjectKey(key);

    const sqlCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectAnnex } = this.baseQueries;

    const sqlCondition = `WHERE LB_APP_KP_ID = '${id}'`;

    const sql = [selectAnnex, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const { kpIn, projectIn, client } = splitKpKey(this.kp);

    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `INSERT INTO ${tableName}
                (FA_PROJECT_IN, GA_KP_IN, DC_CLIENT_IN, LB_NAME_APP_KP, LB_NOTE, DA_EMPLOYEE_ID, LB_DATE_CREATION, LB_MODIFIER, LB_DATE_MODI, LB_PATH_APP_KP, LB_APP_KP_AMOUNT) 
                VALUES 
                ('${projectIn}', '${kpIn}', '${client}', '${this.annextName}', ${note}, '${this.user}', CURRENT_DATE(), '${this.user}', CURRENT_DATE(), '${this.docsArray}', '${this.budget}');`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `UPDATE ${tableName}
                SET
                LB_NAME_APP_KP = '${this.annextName}',
                LB_NOTE = ${note},
                LB_MODIFIER = '${this.user}',
                LB_DATE_MODI = CURRENT_DATE(),
                LB_APP_KP_AMOUNT = '${this.budget}',
                LB_PATH_APP_KP = '${this.docsArray}'
                WHERE (LB_APP_KP_ID = '${id}');`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Annex;
