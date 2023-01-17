const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { FIRST_PASSWORD } = require("../config");

class User {
  constructor(LOGIN) {
    this.LOGIN = LOGIN;
  }

  static getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.01_A_AUTHORIZATION_T`;

    return db.execute(sql);
  }

  static getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.01_A_AUTHORIZATION_T where A_AUTHORIZATION_ID = '${ID}'`;

    return db.execute(sql);
  }

  static setPassword(ID, password) {
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sql = `UPDATE gdxem63mnchn3886.01_A_AUTHORIZATION_T SET A_PASSWORD = '${newPassword}' WHERE (A_AUTHORIZATION_ID = '${ID}')`;
    return db.execute(sql);
  }

  static setToken(ID, token) {
    const sql = `UPDATE gdxem63mnchn3886.01_A_AUTHORIZATION_T SET A_TOKEN = '${token}' WHERE (A_AUTHORIZATION_ID = '${ID}')`;
    return db.execute(sql);
  }

  static resetToken(ID) {
    const sql = `UPDATE gdxem63mnchn3886.01_A_AUTHORIZATION_T SET A_TOKEN = NULL WHERE (A_AUTHORIZATION_ID = '${ID}')`;
    return db.execute(sql);
  }

  static comparePassword(enteredPassword, existingPassword) {
    return bcrypt.compareSync(enteredPassword, existingPassword);
  }

  add() {
    const sql = `INSERT INTO gdxem63mnchn3886.01_A_AUTHORIZATION_T
    (A_LOGIN, A_PASSWORD)
    VALUES
    ('${this.LOGIN}', '${FIRST_PASSWORD}')`;

    return db.execute(sql);
  }
}

module.exports = User;
