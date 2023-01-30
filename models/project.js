const db = require("../config/db");

class Project {
  constructor(ID, ID_DEP_CLIENT, ID_PROJECT) {
    this.ID = ID;
    this.ID_DEP_CLIENT = ID_DEP_CLIENT;
    this.ID_PROJECT = ID_PROJECT;
  }

  static async getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.FA_PROJECT_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(id) {
    const [projectIn, orgstructure, personaId] = id.split("-");
    const client = [orgstructure, personaId].join("-");

    const sql = `SELECT * FROM gdxem63mnchn3886.FA_PROJECT_T
     WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = "${client}"`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async getbyClientId(id) {
    const sql = `SELECT * FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DC_CLIENT_IN = "${id}"`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getbyUserId(id) {
    const sql = `SELECT * FROM gdxem63mnchn3886.FA_PROJECT_T
    WHERE DA_EMPLOYEE_ID = "${id}"`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  add() {
    const sql = `
    INSERT INTO PROJECT_NUM_T(
        ID,
        ID_DEP_CLIENT,
        ID_PROJECT)
        VALUES(
            '${this.ID}',
            '${this.ID_DEP_CLIENT}',
            '${this.ID_PROJECT}'
        )`;

    return db.execute(sql);
  }
}

module.exports = Project;
