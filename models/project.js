const db = require("../config/db");

class Project {
  constructor({ clientId, userId, orgStructureId }) {
    this.client = clientId;
    this.user = userId;
    this.orgStructureId = orgStructureId;
  }

  async newId() {
    const sql = `SELECT FA_PROJECT_IN AS id
    FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DC_CLIENT_IN = "${this.client}"`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  static async getProjectKeysArray(sql) {
    const [projects, _] = await db.execute(sql);

    if (projects.length === 0) {
      return [];
    }

    const result = projects.map(item => item.projectKey);

    return result;
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
    const sql = `SELECT CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey" 
    FROM gdxem63mnchn3886.FA_PROJECT_T`;
    const result = await this.getProjectKeysArray(sql);
    return result;
  }

  static async getForClient(id) {
    const sql = `SELECT CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey"
    FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DC_CLIENT_IN = "${id}"`;
    const result = await this.getProjectKeysArray(sql);
    return result;
  }

  static async getForUser(id) {
    const sql = `SELECT CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey"
    FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DA_EMPLOYEE_ID = "${id}"`;
    const result = await this.getProjectKeysArray(sql);
    return result;
  }

  static async getForOrg(id) {
    const sql = `SELECT CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey"
    FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE EA_ORG_STRUCTURE_IN = "${id}"`;
    const result = await this.getProjectKeysArray(sql);
    return result;
  }

  static async getByKey(key) {
    const { projectIn, client } = this.splitKey(key);

    const sql = `SELECT *, CONCAT(FA_PROJECT_IN, "-", DC_CLIENT_IN) AS "projectKey"
    FROM gdxem63mnchn3886.FA_PROJECT_T
     WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = "${client}"`;
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
(FA_PROJECT_IN, EA_ORG_STRUCTURE_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, FA_DATE_CREATION, FA_DATE_MODI, FA_MODIFIER)
VALUES('${id}', '${this.orgStructureId}', '${this.client}', '${this.user}', '${creationDate}', '${creationDate}', '${this.user}')`;
    await db.execute(sql);
    return [id, this.client].join("-");
  }
}

module.exports = Project;
