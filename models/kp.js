const db = require("../config/db");
const Project = require("../models/project");

class Kp {
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
    selectKp: `SELECT 
            CONCAT(kp.GA_KP_IN, "-", kp.FA_PROJECT_IN, "-", kp.DC_CLIENT_IN) as kpKey,
            kp.DA_EMPLOYEE_ID AS "userId",
            emp.DA_EMPLOYEE_NAME AS "userName",
            kp.DD_DESIGNER_ID AS "designerId",
            dis.DD_DESIGNER_NAME AS "designerName",
            kp.GA_AGENT_BONUS AS "designerBonus",
            kp.GA_NOTE_KP AS "kpNote",
            kp.GA_DATE_CREATION AS "creationDate",
            kp.GA_DATE_FIN AS "finalDate",
            kp.EA_ORG_STRUCTURE_IN  AS "orgStructureId",
            org.EA_FULL_NAME_ORG AS "orgName"
            FROM gdxem63mnchn3886.GA_KP_T kp
            LEFT JOIN gdxem63mnchn3886.DA_EMPLOYEE_T emp
            ON kp.DA_EMPLOYEE_ID = emp.DA_EMPLOYEE_ID
            LEFT JOIN gdxem63mnchn3886.DD_DESIGNER_T dis
            ON kp.DD_DESIGNER_ID = dis.DD_DESIGNER_ID
            LEFT JOIN gdxem63mnchn3886.EA_ORG_STRUCTURE_T org
            ON kp.EA_ORG_STRUCTURE_IN = org.EA_ORG_STRUCTURE_IN`,
    selectArray: `SELECT 
            CONCAT(kp.GA_KP_IN, "-", kp.FA_PROJECT_IN, "-", kp.DC_CLIENT_IN) as kpKey,
            pro.DA_EMPLOYEE_ID AS "managerId",
            emp2.DA_EMPLOYEE_NAME AS "managerName",
            kp.DA_EMPLOYEE_ID AS "userId",
            emp.DA_EMPLOYEE_NAME AS "userName",
            kp.GA_NOTE_KP AS "kpNote",
            kp.GA_DATE_CREATION AS "creationDate",
            kp.GA_DATE_FIN AS "finalDate"
            FROM gdxem63mnchn3886.GA_KP_T kp
            LEFT JOIN gdxem63mnchn3886.DA_EMPLOYEE_T emp
            ON kp.DA_EMPLOYEE_ID = emp.DA_EMPLOYEE_ID
            LEFT JOIN gdxem63mnchn3886.FA_PROJECT_T pro
            ON kp.FA_PROJECT_IN = pro.FA_PROJECT_IN AND kp.DC_CLIENT_IN = pro.DC_CLIENT_IN
            LEFT JOIN gdxem63mnchn3886.DA_EMPLOYEE_T emp2
            ON pro.DA_EMPLOYEE_ID = emp2.DA_EMPLOYEE_ID`,
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
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static splitKey(key) {
    const [kpIn, projectIn, orgstructure, personaId] = key.split("-");
    const client = [orgstructure, personaId].join("-");

    return {
      kpIn,
      projectIn,
      client,
    };
  }

  // static async getAll() {
  //   const { selectArray: sql } = this.baseQueries;
  //   const [projects, _] = await db.execute(sql);
  //   return projects;
  // }

  static async getForProject(projectKey) {
    const { projectIn, client } = await Project.splitKey(projectKey);

    const sqlCondition = `WHERE kp.FA_PROJECT_IN = '${projectIn}' AND kp.DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByKey(key) {
    const { kpIn, projectIn, client } = this.splitKey(key);

    const { selectKp } = this.baseQueries;

    const sqlCondition = `WHERE GA_KP_IN = '${kpIn}' AND FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

    const sql = [selectKp, sqlCondition].join(" ");

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

module.exports = Kp;
