const db = require("../config/db");
const { splitKpKey, splitProjectKey } = require("../modifiers");

class Annex {
  constructor({ kpKey, userId, annexNumber, annexNote, docsArray }) {
    this.user = userId;
    this.kp = kpKey;
    this.annextName = annexNumber;
    this.note = annexNote;
    this.docsArray = docsArray;
  }

  static baseQueries = {
    selectAnnex: `SELECT
                LB_APP_KP_ID as 'annexId',
                LB_NAME_APP_KP as 'annexNumber',
                LB_NOTE as 'annexNote',
                LB_PATH_APP_KP as 'docsArray'
                FROM gdxem63mnchn3886.LB_APP_KP_T`,
    selectArray: `SELECT
                LB_APP_KP_ID as 'annexId',
                LB_NAME_APP_KP as 'annexNumber',
                LB_NOTE as 'annexNote',
                LB_PATH_APP_KP as 'docsArray'
                FROM gdxem63mnchn3886.LB_APP_KP_T`,
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

  //   static async delete(key) {
  //     const { kpIn, projectIn, client } = this.splitKey(key);
  //     const sql = `DELETE FROM gdxem63mnchn3886.GA_KP_T
  //     WHERE GA_KP_IN = '${kpIn}' AND FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

  //     const [result, _] = await db.execute(sql);

  //     return result;
  //   }

  async add() {
    const { kpIn, projectIn, client } = splitKpKey(this.kp);

    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `INSERT INTO gdxem63mnchn3886.LB_APP_KP_T
                (FA_PROJECT_IN, GA_KP_IN, DC_CLIENT_IN, LB_NAME_APP_KP, LB_NOTE, DA_EMPLOYEE_ID, LB_DATE_CREATION, LB_MODIFIER, LB_DATE_MODI, LB_PATH_APP_KP) 
                VALUES 
                ('${projectIn}', '${kpIn}', '${client}', '${this.annextName}', ${note}, '${this.user}', CURRENT_DATE(), '${this.user}', CURRENT_DATE(), '${this.docsArray}');`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `UPDATE gdxem63mnchn3886.LB_APP_KP_T
                SET
                LB_NAME_APP_KP = '${this.annextName}',
                LB_NOTE = ${note},
                LB_MODIFIER = '${this.user}',
                LB_DATE_MODI = CURRENT_DATE(),
                LB_PATH_APP_KP = '${this.docsArray}'
                WHERE (LB_APP_KP_ID = '${id}');`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Annex;
