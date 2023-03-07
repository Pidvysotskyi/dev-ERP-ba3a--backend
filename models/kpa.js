const db = require("../config/db");
const { splitKpKey, splitKpxKey } = require("../modifiers");

const { kpaTableName: tableName, kpTableName } = require("./sqlTableNames");

class Kpa {
  constructor({ kpKey, userId, subKpNote }) {
    this.kp = kpKey;
    this.modifier = userId;
    this.note = subKpNote;
  }

  static baseQueries = {
    selectKp: `SELECT
    CONCAT(kpa.GA_KP_IN, "-", kpa.FA_PROJECT_IN, "-", kpa.DC_CLIENT_IN, "-", "a", GB_KP_A_IN) as subKpKey,
    kpa.GB_NOTE_KP_A AS "subKpNote",
    kp.GA_DATE_START AS "startDate",
    kp.GA_DATE_FIN AS "finalDate"
    FROM ${tableName} kpa
    LEFT JOIN ${kpTableName} kp
    ON kpa.GA_KP_IN = kp.GA_KP_IN AND kpa.FA_PROJECT_IN = kp.FA_PROJECT_IN AND kpa.DC_CLIENT_IN = kp.DC_CLIENT_IN`,
    selectArray: `SELECT
    CONCAT(kpa.GA_KP_IN, "-", kpa.FA_PROJECT_IN, "-", kpa.DC_CLIENT_IN, "-", "a", GB_KP_A_IN) as subKpKey,
    kpa.GB_NOTE_KP_A AS "subKpNote",
    kp.GA_DATE_START AS "startDate",
    kp.GA_DATE_FIN AS "finalDate"
    FROM ${tableName} kpa
    LEFT JOIN ${kpTableName} kp
    ON kpa.GA_KP_IN = kp.GA_KP_IN AND kpa.FA_PROJECT_IN = kp.FA_PROJECT_IN AND kpa.DC_CLIENT_IN = kp.DC_CLIENT_IN`,
  };

  async newId() {
    const { kpIn, projectIn, client } = splitKpKey(this.kp);

    const sql = `SELECT GB_KP_A_IN AS id
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

    const sqlCondition = `WHERE kpa.GA_KP_IN = '${kpIn}' AND kpa.DC_CLIENT_IN = "${client}" AND kpa.FA_PROJECT_IN = "${projectIn}"`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getForUser(userId) {
    const sqlCondition = `WHERE kpa.DA_EMPLOYEE_ID = '${userId}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByKey(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const { selectKp } = this.baseQueries;

    const sqlCondition = `WHERE kpa.GA_KP_IN = '${kpIn}' AND kpa.FA_PROJECT_IN = '${projectIn}' AND kpa.DC_CLIENT_IN = '${client}' AND kpa.GB_KP_A_IN = '${kpxIn}'`;

    const sql = [selectKp, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const id = await this.newId();
    const { kpIn, projectIn, client } = splitKpKey(this.kp);
    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `INSERT INTO ${tableName} 
    (GB_KP_A_IN, GA_KP_IN, FA_PROJECT_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, GB_DATE_CREATION, GB_DATE_MODI, GB_MODIFIER, GB_NOTE_KP_A)
    VALUES
    ('${id}', '${kpIn}', '${projectIn}', '${client}', '${this.modifier}', CURRENT_DATE(), CURRENT_DATE(), '${this.modifier}', ${note})`;
    await db.execute(sql);
    return [kpIn, projectIn, client, `a${id}`].join("-");
  }

  async updateNote(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const sql = `UPDATE ${tableName}
    SET
    GB_DATE_MODI = CURRENT_DATE(),
    GB_MODIFIER = '${this.modifier}',
    GB_NOTE_KP_A = '${this.note}'
    WHERE (GA_KP_IN = '${kpIn}') AND (FA_PROJECT_IN = '${projectIn}') AND (DC_CLIENT_IN = '${client}') AND (GB_KP_A_IN = '${kpxIn}')`;
    await db.execute(sql);
  }

  async update(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);

    const sql = `UPDATE ${tableName}
    SET
    GB_DATE_MODI = CURRENT_DATE(),
    WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}') AND (GB_KP_A_IN = '${kpxIn})'`;
    await db.execute(sql);
  }

  async changeStatus(key) {
    const { kpIn, projectIn, client, kpxIn } = splitKpxKey(key);
    const sql = `UPDATE ${tableName} 
    SET 
    GA_DATE_MODI = CURRENT_DATE()', 
    GA_MODIFIER = '${this.user}'
    GA_KP_STATUS = '${this.status}'
    WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}') AND (GB_KP_A_IN = '${kpxIn})'`;
    await db.execute(sql);
  }
}

module.exports = Kpa;
