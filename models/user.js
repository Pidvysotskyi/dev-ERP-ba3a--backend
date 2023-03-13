const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { FIRST_PASSWORD } = require("../config");

const { userTableName: tableName } = require("./sqlTableNames");

class User {
  constructor({ personaId, login, fullName, orgStructureId, creatorId, positionId }) {
    this.login = login;
    this.personaId = personaId;
    this.fullName = fullName;
    this.orgStructureId = orgStructureId;
    this.creator = creatorId;
    this.position = positionId;
  }

  static async getAll() {
    const sql = `SELECT * FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(id) {
    const sql = `SELECT * FROM ${tableName} where DA_EMPLOYEE_ID = '${id}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async getOrgStructure(id) {
    const sql = `SELECT EA_ORG_STRUCTURE_IN as orgStructure FROM ${tableName} where DA_EMPLOYEE_ID = '${id}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async findbyPersona(id) {
    const sql = `SELECT * FROM ${tableName} WHERE CA_PERSONA_ID = '${id}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  static setPassword(id, password) {
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sql = `UPDATE ${tableName} SET DA_PASSWORD = '${newPassword}' WHERE (DA_EMPLOYEE_ID = '${id}')`;
    return db.execute(sql);
  }

  static setToken(id, token) {
    const sql = `UPDATE ${tableName} SET DA_TOKEN = '${token}' WHERE (DA_EMPLOYEE_ID = '${id}')`;
    return db.execute(sql);
  }

  static resetToken(id) {
    const sql = `UPDATE ${tableName} SET DA_TOKEN = NULL WHERE (DA_EMPLOYEE_ID = '${id}')`;
    return db.execute(sql);
  }

  static comparePassword(enteredPassword, existingPassword) {
    return bcrypt.compareSync(enteredPassword, existingPassword);
  }

  async newId() {
    const sql = `SELECT DA_EMPLOYEE_ID AS id
    FROM ${tableName}`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  async add() {
    const id = await this.newId();
    const sql = `INSERT INTO ${tableName}
    (DA_EMPLOYEE_ID, DA_EMPLOYEE_NAME, CA_PERSONA_ID, EA_ORG_STRUCTURE_IN, DA_CREATOR, DA_DATA_CREATION, DA_MODIFIER, DA_DATE_MODI, DA_LOGIN, DA_PASSWORD, EE_EMPLOYEE_POSITION_ID)
    VALUES ('${id}', '${this.fullName}', '${this.personaId}', '${this.orgStructureId}', '${this.creator}', CURRENT_DATE(), '${this.creator}', CURRENT_DATE(), '${this.login}', '${FIRST_PASSWORD}', '${this.position}')`;
    await db.execute(sql);
    return id;
  }
}

module.exports = User;
