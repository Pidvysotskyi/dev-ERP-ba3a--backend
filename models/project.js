const db = require("../config/db");

class Project {
  constructor({ clientId, userId, orgStructureId, designerId, designNumber, projectAdress, finalDate }) {
    this.client = clientId;
    this.user = userId;
    this.orgStructureId = orgStructureId;
    this.designer = designerId;
    this.designNumber = designNumber;
    this.projectAdress = projectAdress;
    this.finalDate = finalDate;
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
              pro.FA_DESIGN_NUM_IN AS "designNumber",
              pro.FA_PROJECT_ADRESS AS "projectAdress",
              pro.FA_BALANCE_CLIENT AS "clientBalance",
              pro.FA_PROJECT_STATUS AS "projectStatus",
              pro.FA_DATE_CREATION AS "creationDate",
              pro.FA_DATE_FIN AS "finalDate"
              FROM gdxem63mnchn3886.FA_PROJECT_T pro`,
    selectArray: `SELECT
              CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey",
              pro.DD_DESIGNER_ID AS "designerId",
              dis.DD_DESIGNER_NAME  AS "designerName",
              pro.FA_PROJECT_ADRESS  AS "projectAdress",
              pro.FA_DATE_CREATION  AS "creationDate",
              pro.FA_DATE_FIN AS "finalDate",
              pro.FA_PROJECT_STATUS AS "projectStatus"
              FROM gdxem63mnchn3886.FA_PROJECT_T pro`,

    joinDesigner: `LEFT JOIN gdxem63mnchn3886.DD_DESIGNER_T dis
                  ON pro.DD_DESIGNER_ID = dis.DD_DESIGNER_ID`,
    joinUser: `LEFT JOIN gdxem63mnchn3886.DA_EMPLOYEE_T emp
              ON pro.DA_EMPLOYEE_ID = emp.DA_EMPLOYEE_ID`,
    joinOrgStructure: `LEFT JOIN gdxem63mnchn3886.EA_ORG_STRUCTURE_T org
              ON pro.EA_ORG_STRUCTURE_IN = org.EA_ORG_STRUCTURE_IN`,
  };

  async newId() {
    const sql = `SELECT FA_PROJECT_IN AS id
    FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DC_CLIENT_IN = "${this.client}"`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  static async getSpecificArray(sqlCondition) {
    const { selectArray, joinDesigner } = this.baseQueries;
    const sql = [selectArray, joinDesigner, sqlCondition].join(" ");
    const [projects, _] = await db.execute(sql);
    return projects;
  }

  static splitKey(key) {
    const [projectIn, orgstructure, personaId] = key.split("-");
    const client = [orgstructure, personaId].join("-");

    return {
      projectIn,
      client,
    };
  }

  static async getAll() {
    const { selectArray, joinDesigner } = this.baseQueries;
    const sql = [selectArray, joinDesigner].join(" ");
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

  static async getByKey(key) {
    const { projectIn, client } = this.splitKey(key);

    const { selectProject, joinOrgStructure, joinUser, joinDesigner } = this.baseQueries;

    const sqlCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

    const sql = [selectProject, joinOrgStructure, joinUser, joinDesigner, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async delete(key) {
    const { projectIn, client } = this.splitKey(key);
    const sql = `DELETE FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = "${client}"`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  async add() {
    const id = await this.newId();
    const date = new Date();
    const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const sql = `INSERT INTO gdxem63mnchn3886.FA_PROJECT_T
(FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, FA_DATE_CREATION, FA_DATE_MODI, FA_MODIFIER, DD_DESIGNER_ID, FA_PROJECT_ADRESS, FA_DATE_FIN, FA_DESIGN_NUM_IN)
VALUES('${id}', '${this.orgStructureId}', '${this.client}', '${this.user}', '${creationDate}', '${creationDate}', '${this.user}', '${this.designer}', '${this.projectAdress}', '${this.finalDate}', '${this.designNumber}')`;
    await db.execute(sql);
    return [id, this.client].join("-");
  }
}

module.exports = Project;
