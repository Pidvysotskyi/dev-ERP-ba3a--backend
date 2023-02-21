const db = require("../config/db");
const Project = require("../models/project");

class Contract {
  constructor({ projectKey, orgStructureId, userId, contractNumber, contractNote, contractDeadline, docsArray }) {
    this.user = userId;
    this.project = projectKey;
    this.orgStructure = orgStructureId;
    this.contractName = contractNumber;
    this.note = contractNote;
    this.deadline = contractDeadline;
    this.docsArray = docsArray;
  }

  static baseQueries = {
    selectContract: `SELECT 
            LA_CONTRACT_ID as 'contractId',
            LA_NAME_CONTRACT as 'contractNumber',
            LA_NOTE as 'contractNote',
            LA_PROJECT_TIMELINE as 'contractDeadline',
            LA_PATH_CONTRACT as 'docsArray'
            FROM gdxem63mnchn3886.LA_CONTRACT_T`,
    selectArray: `SELECT 
            LA_CONTRACT_ID as 'contractId',
            LA_NAME_CONTRACT as 'contractNumber',
            LA_NOTE as 'contractNote',
            LA_PROJECT_TIMELINE as 'contractDeadline',
            LA_PATH_CONTRACT as 'docsArray'
            FROM gdxem63mnchn3886.LA_CONTRACT_T`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForProject(key) {
    const { projectIn, client } = await Project.splitKey(key);

    const sqlCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectContract } = this.baseQueries;

    const sqlCondition = `WHERE LA_CONTRACT_ID = '${id}'`;

    const sql = [selectContract, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async delete(key) {
    const { kpIn, projectIn, client } = this.splitKey(key);
    const sql = `DELETE FROM gdxem63mnchn3886.GA_KP_T
    WHERE GA_KP_IN = '${kpIn}' AND FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  async add() {
    const { projectIn, client } = await Project.splitKey(this.project);

    const note = this.note ? JSON.stringify(this.note) : null;
    const deadline = this.deadline ? JSON.stringify(this.deadline) : null;

    const sql = `INSERT IGNORE INTO gdxem63mnchn3886.LA_CONTRACT_T
                (FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, LA_NAME_CONTRACT, DA_EMPLOYEE_ID, LA_DATE_CREATION, LA_NOTE, LA_PROJECT_TIMELINE, LA_MODIFIER, LA_DATE_MODI, LA_PATH_CONTRACT)
                VALUES
                ('${projectIn}', '${this.orgStructure}', '${client}', '${this.contractName}', '${this.user}', CURRENT_DATE(), ${note}, ${deadline}, '${this.user}', CURRENT_DATE(), '${this.docsArray}')`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const note = this.note ? JSON.stringify(this.note) : null;
    const deadline = this.deadline ? JSON.stringify(this.deadline) : null;

    const sql = `UPDATE gdxem63mnchn3886.LA_CONTRACT_T
    SET
    LA_NAME_CONTRACT = '${this.contractName}',
    LA_NOTE = ${note},
    LA_PROJECT_TIMELINE = ${deadline},
    LA_MODIFIER = '${this.user}',
    LA_DATE_MODI = CURRENT_DATE(),
    LA_PATH_CONTRACT = '${this.docsArray}'
    WHERE LA_CONTRACT_ID = '${id}'`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Contract;
