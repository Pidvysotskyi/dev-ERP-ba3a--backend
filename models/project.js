const db = require("../config/db");
const { splitProjectKey } = require("../modifiers");

const { projectTableName: tableName, orgStructureTableName, userTableName, designerTableName } = require("./sqlTableNames");

const getPesonalCondition = projectKey => {
  const { projectIn, client } = splitProjectKey(projectKey);

  const personalCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

  return personalCondition;
};

class Project {
  constructor({ clientId, userId, orgStructureId, designerId, designNumber, projectAdress, finalDate, status }) {
    this.client = clientId;
    this.user = userId;
    this.orgStructureId = orgStructureId;
    this.designer = designerId;
    this.designNumber = designNumber;
    this.projectAdress = projectAdress;
    this.finalDate = finalDate;
    this.status = status;
  }

  static baseQueries = {
    selectProject: `SELECT
            CONCAT(pro.FA_PROJECT_IN, "-", pro.DC_CLIENT_IN) AS "projectKey",
            pro.DC_CLIENT_IN AS "clientId",
            pro.EA_ORG_STRUCTURE_IN AS "orgStructureId",
            org.EA_FULL_NAME_ORG AS "orgName",
            pro.DA_EMPLOYEE_ID AS "userId",
            emp.DA_EMPLOYEE_NAME AS "userName",
            pro.DD_DESIGNER_ID AS "designerId",
            dis.DD_DESIGNER_NAME AS "designerName",
            dis.DD_AGENT_BONUS AS "designerBonus",
            pro.FA_DESIGN_NUM_IN AS "designNumber",
            pro.FA_PROJECT_ADRESS AS "projectAdress",
            pro.FA_BALANCE_CLIENT AS "clientBalance",
            pro.FA_PROJECT_STATUS AS "projectStatus",
            pro.FA_DATE_CREATION AS "creationDate",
            pro.FA_DATE_FIN AS "finalDate"
            FROM ${tableName} pro
            LEFT JOIN ${orgStructureTableName} org
            ON pro.EA_ORG_STRUCTURE_IN = org.EA_ORG_STRUCTURE_IN
            LEFT JOIN ${userTableName} emp
            ON pro.DA_EMPLOYEE_ID = emp.DA_EMPLOYEE_ID
            LEFT JOIN ${designerTableName} dis
            ON pro.DD_DESIGNER_ID = dis.DD_DESIGNER_ID`,
    selectArray: `SELECT
            CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey",
            pro.DD_DESIGNER_ID AS "designerId",
            dis.DD_DESIGNER_NAME  AS "designerName",
            pro.FA_PROJECT_ADRESS  AS "projectAdress",
            pro.FA_DATE_CREATION  AS "creationDate",
            pro.FA_DATE_FIN AS "finalDate",
            pro.FA_PROJECT_STATUS AS "projectStatus"
            FROM ${tableName} pro
            LEFT JOIN ${designerTableName} dis
            ON pro.DD_DESIGNER_ID = dis.DD_DESIGNER_ID`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [projects, _] = await db.execute(sql);
    return projects;
  }

  static async getAll() {
    const { selectArray: sql } = this.baseQueries;
    const [projects, _] = await db.execute(sql);
    return projects;
  }

  static async getForClient(id) {
    const sqlCondition = `WHERE DC_CLIENT_IN = "${id}"`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getForUser(id) {
    const sqlCondition = `WHERE DA_EMPLOYEE_ID = "${id}"`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getForOrg(id) {
    const sqlCondition = `WHERE EA_ORG_STRUCTURE_IN = "${id}"`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByKey(projectKey) {
    const personalCondition = getPesonalCondition(projectKey);

    const { selectProject } = this.baseQueries;

    const sql = [selectProject, personalCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT FA_PROJECT_IN AS id
    FROM ${tableName}
    WHERE DC_CLIENT_IN = "${this.client}"`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  async add() {
    const id = await this.newId();
    const sql = `INSERT INTO ${tableName}
(FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, FA_DATE_CREATION, FA_DATE_MODI, FA_MODIFIER, DD_DESIGNER_ID, FA_PROJECT_ADRESS, FA_DATE_FIN, FA_DESIGN_NUM_IN, FA_PROJECT_STATUS)
VALUES('${id}', '${this.orgStructureId}', '${this.client}', '${this.user}', CURRENT_DATE(), CURRENT_DATE(), '${this.user}', '${this.designer}', '${this.projectAdress}', '${this.finalDate}', '${this.designNumber}', '${this.status}')`;
    await db.execute(sql);
    return [id, this.client].join("-");
  }

  async changeStatus(projectKey) {
    const personalCondition = getPesonalCondition(projectKey);
    const sql = `UPDATE ${tableName}
    SET
    FA_PROJECT_STATUS = '${this.status}',
    FA_MODIFIER = '${this.user}',
    FA_DATE_MODI = CURRENT_DATE()
    ${personalCondition}`;
    await db.execute(sql);
  }

  async update(projectKey) {
    const personalCondition = getPesonalCondition(projectKey);

    const sql = `UPDATE ${tableName}
    SET 
    DD_DESIGNER_ID = '${this.designer}',
    FA_DESIGN_NUM_IN = '${this.designNumber}', 
    FA_PROJECT_ADRESS = '${this.projectAdress}',
    FA_DATE_FIN = '${this.finalDate}',
    FA_DATE_MODI = CURRENT_DATE(),
    FA_MODIFIER = '${this.user}'
    ${personalCondition}`;
    await db.execute(sql);
  }
}

module.exports = Project;
