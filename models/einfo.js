const db = require("../config/db");
const Project = require("../models/project");

class Einfo {
  constructor({ projectKey, orgStructureId, userId, einfoNote, docsArray }) {
    this.user = userId;
    this.project = projectKey;
    this.orgStructure = orgStructureId;
    this.note = einfoNote;
    this.docsArray = docsArray;
  }

  static baseQueries = {
    selectEinfo: `SELECT
                LE_E_INFO_ID as 'einfoId',
                LE_NAME_NOTE as 'einfoNote',
                LE_DATE_CREATION as 'einfoCreationDate',
                LE_PATH_E_INFO as 'docsArray'
                FROM gdxem63mnchn3886.LE_E_INFO_T`,
    selectArray: `SELECT
                LE_E_INFO_ID as 'einfoId',
                LE_NAME_NOTE as 'einfoNote',
                LE_DATE_CREATION as 'einfoCreationDate',
                LE_PATH_E_INFO as 'docsArray'
                FROM gdxem63mnchn3886.LE_E_INFO_T`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [einfo, _] = await db.execute(sql);
    return einfo;
  }

  static async getForProject(key) {
    const { projectIn, client } = await Project.splitKey(key);

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

  // static async delete(key) {
  //   const { kpIn, projectIn, client } = this.splitKey(key);
  //   const sql = `DELETE FROM gdxem63mnchn3886.GA_KP_T
  //   WHERE GA_KP_IN = '${kpIn}' AND FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

  //   const [result, _] = await db.execute(sql);

  //   return result;
  // }

  async add() {
    const { projectIn, client } = await Project.splitKey(this.project);

    const sql = `INSERT INTO gdxem63mnchn3886.LE_E_INFO_T 
    (FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, LE_NAME_NOTE, DA_EMPLOYEE_ID, LE_DATE_CREATION, LE_MODIFIER, LE_DATE_MODI, LE_PATH_E_INFO) 
    VALUES 
    ('${projectIn}', '${this.orgStructure}', '${client}', '${this.note}', '${this.user}', CURRENT_DATE(), '${this.user}', CURRENT_DATE(), '${this.docsArray}')`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const sql = `UPDATE gdxem63mnchn3886.LE_E_INFO_T SET 
    LE_NAME_NOTE = '${this.note}', 
    LE_MODIFIER = '${this.user}', 
    LE_DATE_MODI = CURRENT_DATE(), 
    LE_PATH_E_INFO = '${this.docsArray}'
    WHERE (LE_E_INFO_ID = '${id}')`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Einfo;
