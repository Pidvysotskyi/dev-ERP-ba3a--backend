const db = require("../config/db");
const { splitKpKey, splitProjectKey } = require("../modifiers");

class Kp {
  constructor({ projectKey, managerKpId, orgStructureId, designerId, designerBonus, startDate, finalDate, kpNote, userId }) {
    this.project = projectKey;
    this.managerKp = managerKpId;
    this.orgStructureId = orgStructureId;
    this.designer = designerId;
    this.designerBonus = designerBonus;
    this.startDate = startDate;
    this.finalDate = finalDate;
    this.kpNote = kpNote;
    this.modifier = userId;
  }

  static baseQueries = {
    selectKp: `SELECT 
            CONCAT(kp.GA_KP_IN, "-", kp.FA_PROJECT_IN, "-", kp.DC_CLIENT_IN) as kpKey,
            kp.DA_EMPLOYEE_ID AS "managerKpId",
            emp.DA_EMPLOYEE_NAME AS "managerKpName",
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
            pro.DA_EMPLOYEE_ID AS "projectManagerId",
            emp2.DA_EMPLOYEE_NAME AS "projectManagerName",
            kp.DA_EMPLOYEE_ID AS "managerKpId",
            emp.DA_EMPLOYEE_NAME AS "managerKpName",
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
    const { projectIn, client } = splitProjectKey(this.project);

    const sql = `SELECT GA_KP_IN AS id
    FROM gdxem63mnchn3886.GA_KP_T
    WHERE DC_CLIENT_IN = "${client}" AND FA_PROJECT_IN = "${projectIn}"`;

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

  static async getForProject(projectKey) {
    const { projectIn, client } = splitProjectKey(projectKey);

    const sqlCondition = `WHERE kp.FA_PROJECT_IN = '${projectIn}' AND kp.DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByKey(key) {
    const { kpIn, projectIn, client } = splitKpKey(key);

    const { selectKp } = this.baseQueries;

    const sqlCondition = `WHERE GA_KP_IN = '${kpIn}' AND FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;

    const sql = [selectKp, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const id = await this.newId();
    const { projectIn, client } = splitProjectKey(this.project);

    const sql = `INSERT INTO gdxem63mnchn3886.GA_KP_T 
    (GA_KP_IN, FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, GA_DATE_START, GA_DATE_CREATION, GA_DATE_FIN, GA_DATE_MODI, DD_DESIGNER_ID, GA_AGENT_BONUS, GA_NOTE_KP, GA_MODIFIER)
    VALUES
    ('${id}', '${projectIn}', '${this.orgStructureId}', '${client}', '${this.managerKp}', '${this.startDate}', CURRENT_DATE(), '${this.finalDate}', CURRENT_DATE(), '${this.designer}', '${this.designerBonus}', '${this.kpNote}', '${this.modifier}');`;
    await db.execute(sql);
    return [id, this.project].join("-");
  }

  async updateNote(key) {
    const { kpIn, projectIn, client } = splitKpKey(key);

    const sql = `UPDATE gdxem63mnchn3886.GA_KP_T
    SET GA_DATE_MODI = CURRENT_DATE(),
    GA_MODIFIER = '${this.modifier}',
    GA_NOTE_KP = '${this.kpNote}' 
    WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}')`;
    await db.execute(sql);
  }

  // async update(key) {
  //   const { kpIn, projectIn, client } = this.splitKey(key);

  //   const sql = `UPDATE gdxem63mnchn3886.GA_KP_T
  //   SET GA_DATE_MODI = CURRENT_DATE(),
  //   GA_MODIFIER = '${this.modifier}',
  //   GA_NOTE_KP = '${this.kpNote}'
  //   WHERE (GA_KP_IN = '${kpIn}') and (FA_PROJECT_IN = '${projectIn}') and (DC_CLIENT_IN = '${client}')`;
  //   await db.execute(sql);
  // }
}

module.exports = Kp;
