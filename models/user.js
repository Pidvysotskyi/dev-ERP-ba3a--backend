const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { FIRST_PASSWORD } = require("../config");

class User {
  constructor({ id, personaId, login, fullName }) {
    this.login = login;
    this.id = id;
    this.personaId = personaId;
    this.fullName = fullName;
  }

  static async getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.DA_EMPLOYEE_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.DA_EMPLOYEE_T where DA_EMPLOYEE_ID = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static setPassword(ID, password) {
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sql = `UPDATE gdxem63mnchn3886.DA_EMPLOYEE_T SET DA_PASSWORD = '${newPassword}' WHERE (DA_EMPLOYEE_ID = '${ID}')`;
    return db.execute(sql);
  }

  static setToken(ID, token) {
    const sql = `UPDATE gdxem63mnchn3886.DA_EMPLOYEE_T SET DA_TOKEN = '${token}' WHERE (DA_EMPLOYEE_ID = '${ID}')`;
    return db.execute(sql);
  }

  static resetToken(ID) {
    const sql = `UPDATE gdxem63mnchn3886.DA_EMPLOYEE_T SET DA_TOKEN = NULL WHERE (DA_EMPLOYEE_ID = '${ID}')`;
    return db.execute(sql);
  }

  static comparePassword(enteredPassword, existingPassword) {
    return bcrypt.compareSync(enteredPassword, existingPassword);
  }

  add() {
    const date = new Date();
    const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const sql = `INSERT INTO gdxem63mnchn3886.DA_EMPLOYEE_T
    (DA_EMPLOYEE_ID, DA_EMPLOYEE_NAME, CA_PERSONA_ID, DA_DATA_CREATION, DA_DATE_MODI, DA_LOGIN, DA_PASSWORD)
    VALUES ('${this.id}', '${this.fullName}', '${this.personaId}', '${creationDate}', '${creationDate}', '${this.login}', '${FIRST_PASSWORD}');`;

    return db.execute(sql);
  }
}

module.exports = User;
