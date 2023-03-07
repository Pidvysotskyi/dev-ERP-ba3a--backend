const db = require("../config/db");
const { splitKpKey, splitKpxKey } = require("../modifiers");

const { kpfTableName: tableName, kpTableName } = require("./sqlTableNames");

class Kpf {
  constructor({ kpKey, userId, subKpNote }) {
    this.kp = kpKey;
    this.modifier = userId;
    this.note = subKpNote;
  }

  static baseQueries = {
    selectKp: `SELECT
    CONCAT(kpf.GA_KP_IN, "-", kpf.FA_PROJECT_IN, "-", kpf.DC_CLIENT_IN, "-", "f", kpf.GC_KP_F_IN) as subKpKey,
    kpf.GC_NOTE_KP_F AS "subKpNote",
    kp.GA_DATE_START AS "startDate",
    kp.GA_DATE_FIN AS "finalDate"
    FROM ${tableName} kpf
    LEFT JOIN ${kpTableName} kp
    ON kpf.GA_KP_IN = kp.GA_KP_IN AND kpf.FA_PROJECT_IN = kp.FA_PROJECT_IN AND kpf.DC_CLIENT_IN = kp.DC_CLIENT_IN`,
    selectArray: `SELECT
    CONCAT(kpf.GA_KP_IN, "-", kpf.FA_PROJECT_IN, "-", kpf.DC_CLIENT_IN, "-", "f", kpf.GC_KP_F_IN) as subKpKey,
    kpf.GC_NOTE_KP_F AS "subKpNote",
    kp.GA_DATE_START AS "startDate",
    kp.GA_DATE_FIN AS "finalDate"
    FROM ${tableName} kpf
    LEFT JOIN ${kpTableName} kp
    ON kpf.GA_KP_IN = kp.GA_KP_IN AND kpf.FA_PROJECT_IN = kp.FA_PROJECT_IN AND kpf.DC_CLIENT_IN = kp.DC_CLIENT_IN`,
  };

  async newId() {
    const { kpIn, projectIn, client } = splitKpKey(this.kp);

    const sql = `SELECT GC_KP_F_IN AS id
    FROM ${tableName}
    WHERE GA_KP_IN = '${kpIn}' AND DC_CLIENT_IN = "${client}" AND FA_PROJECT_IN = "${projectIn}"`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForKp(kpKey) {
    const { kpIn, projectIn, client } = splitKpKey(kpKey);

    const sqlCondition = `WHERE kpf.GA_KP_IN = '${kpIn}' AND kpf.DC_CLIENT_IN = "${client}" AND kpf.FA_PROJECT_IN = "${projectIn}"`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getForUser(userId) {
    const sqlCondition = `WHERE kpf.DA_EMPLOYEE_ID = '${userId}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByKey(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const { selectKp } = this.baseQueries;

    const sqlCondition = `WHERE kpf.GA_KP_IN = '${kpIn}' AND kpf.FA_PROJECT_IN = '${projectIn}' AND kpf.DC_CLIENT_IN = '${client}' AND kpf.GC_KP_F_IN = '${kpxIn}'`;

    const sql = [selectKp, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const id = await this.newId();
    const { kpIn, projectIn, client } = splitKpKey(this.kp);
    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `INSERT INTO ${tableName} 
    (GC_KP_F_IN, GA_KP_IN, FA_PROJECT_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, GC_DATE_CREATION, GC_DATE_MODI, GC_MODIFIER, GC_NOTE_KP_F)
    VALUES
    ('${id}', '${kpIn}', '${projectIn}', '${client}', '${this.modifier}', CURRENT_DATE(), CURRENT_DATE(), '${this.modifier}', ${note})`;
    await db.execute(sql);
    return [kpIn, projectIn, client, `f${id}`].join("-");
  }

  async updateNote(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const sql = `UPDATE ${tableName}
    SET
    GC_DATE_MODI = CURRENT_DATE(),
    GC_MODIFIER = '${this.modifier}',
    GC_NOTE_KP_F = '${this.note}' 
    WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}') AND (GC_KP_F_IN = '${kpxIn}')`;
    await db.execute(sql);
  }

  async update(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const sql = `UPDATE ${tableName}
    SET
    GC_DATE_MODI = CURRENT_DATE(),
    WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}') AND (GC_KP_F_IN = '${kpxIn})'`;
    await db.execute(sql);
  }
}

module.exports = Kpf;
