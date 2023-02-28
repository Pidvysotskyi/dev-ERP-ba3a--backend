const db = require("../config/db");
const { splitProjectKey } = require("../modifiers");

const { contractTableName: tableName } = require("./sqlTableNames");

class Contract {
  constructor({ projectKey, orgStructureId, userId, contractNumber, contractNote, contractDeadline, docsArray, budget }) {
    this.user = userId;
    this.project = projectKey;
    this.orgStructure = orgStructureId;
    this.contractName = contractNumber;
    this.note = contractNote;
    this.deadline = contractDeadline;
    this.docsArray = docsArray;
    this.budget = budget;
  }

  static baseQueries = {
    selectContract: `SELECT
            CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "project",
            LA_CONTRACT_ID as 'contractId',
            LA_NAME_CONTRACT as 'contractNumber',
            LA_NOTE as 'contractNote',
            LA_PROJECT_TIMELINE as 'contractDeadline',
            LA_PROJECT_AMOUNT as 'budget',
            LA_PATH_CONTRACT as 'docsArray'
            FROM ${tableName}`,
    selectArray: `SELECT
            CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "project",
            LA_CONTRACT_ID as 'contractId',
            LA_NAME_CONTRACT as 'contractNumber',
            LA_NOTE as 'contractNote',
            LA_PROJECT_TIMELINE as 'contractDeadline',
            LA_PROJECT_AMOUNT as 'budget',
            LA_PATH_CONTRACT as 'docsArray'
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
    const { selectContract } = this.baseQueries;

    const sqlCondition = `WHERE LA_CONTRACT_ID = '${id}'`;

    const sql = [selectContract, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const { projectIn, client } = splitProjectKey(this.project);

    const note = this.note ? JSON.stringify(this.note) : null;
    const deadline = this.deadline ? JSON.stringify(this.deadline) : null;

    const sql = `INSERT INTO ${tableName}
                (FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, LA_NAME_CONTRACT, DA_EMPLOYEE_ID, LA_DATE_CREATION, LA_NOTE, LA_PROJECT_TIMELINE, LA_MODIFIER, LA_DATE_MODI, LA_PATH_CONTRACT, LA_PROJECT_AMOUNT)
                VALUES
                ('${projectIn}', '${this.orgStructure}', '${client}', '${this.contractName}', '${this.user}', CURRENT_DATE(), ${note}, ${deadline}, '${this.user}', CURRENT_DATE(), '${this.docsArray}' , '${this.budget}')`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const note = this.note ? JSON.stringify(this.note) : null;
    const deadline = this.deadline ? JSON.stringify(this.deadline) : null;

    const sql = `UPDATE ${tableName}
    SET
    LA_NAME_CONTRACT = '${this.contractName}',
    LA_NOTE = ${note},
    LA_PROJECT_TIMELINE = ${deadline},
    LA_MODIFIER = '${this.user}',
    LA_DATE_MODI = CURRENT_DATE(),
    LA_PROJECT_AMOUNT = '${this.budget}',
    LA_PATH_CONTRACT = '${this.docsArray}'
    WHERE LA_CONTRACT_ID = '${id}'`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Contract;
