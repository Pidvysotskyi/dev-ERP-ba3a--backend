const db = require("../config/db");
const { splitProjectKey } = require("../modifiers");

const { einfoTableName: tableName } = require("./sqlTableNames");

class Einfo {
  constructor({ projectKey, orgStructureId, userId, einfoNote, docsArray, dateFrom }) {
    this.user = userId;
    this.project = projectKey;
    this.orgStructure = orgStructureId;
    this.note = einfoNote;
    this.docsArray = docsArray;
    this.dateFrom = dateFrom;
  }

  static baseQueries = {
    selectEinfo: `SELECT
                LE_E_INFO_ID as 'einfoId',
                LE_NAME_NOTE as 'einfoNote',
                LE_DATE_FROM as 'dateFrom',
                LE_PATH_E_INFO as 'docsArray'
                FROM ${tableName}`,
    selectArray: `SELECT
                LE_E_INFO_ID as 'einfoId',
                LE_NAME_NOTE as 'einfoNote',
                LE_DATE_FROM as 'dateFrom',
                LE_PATH_E_INFO as 'docsArray'
                FROM ${tableName}`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [einfo, _] = await db.execute(sql);
    return einfo;
  }

  static async getForProject(key) {
    const { projectIn, client } = splitProjectKey(key);

    const sqlCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectEinfo } = this.baseQueries;

    const sqlCondition = `WHERE (LE_E_INFO_ID = '${id}')`;

    const sql = [selectEinfo, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const { projectIn, client } = splitProjectKey(this.project);

    const sql = `INSERT INTO ${tableName} 
    (FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, LE_NAME_NOTE, DA_EMPLOYEE_ID, LE_DATE_CREATION, LE_MODIFIER, LE_DATE_MODI, LE_PATH_E_INFO, LE_DATE_FROM) 
    VALUES 
    ('${projectIn}', '${this.orgStructure}', '${client}', '${this.note}', '${this.user}', CURRENT_DATE(), '${this.user}', CURRENT_DATE(), '${this.docsArray}', '${this.dateFrom}')`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const sql = `UPDATE ${tableName}
    SET 
    LE_NAME_NOTE = '${this.note}', 
    LE_MODIFIER = '${this.user}', 
    LE_DATE_MODI = CURRENT_DATE(),
    LE_DATE_FROM = '${this.dateFrom}',
    LE_PATH_E_INFO = '${this.docsArray}'
    WHERE (LE_E_INFO_ID = '${id}')`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Einfo;
