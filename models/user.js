const bcrypt = require("bcryptjs");
const db = require("../config/db");

class User {
  constructor(LOGIN, PASSWORD) {
    this.LOGIN = LOGIN;
    this.PASSWORD = PASSWORD;
  }

  static getAll() {
    const sql = "SELECT * FROM gdxem63mnchn3886.AUTHORIZATION_T";

    return db.execute(sql);
  }

  add() {
    const sql = `
    INSERT INTO PROJECT_NUM_T(
        ID,
        LOGIN,
        PASSWORD)
        VALUES(
    
            '${this.LOGIN}',
            '${this.PASSWORD}'
        )`;

    return db.execute(sql);
  }

  static setPassword(ID, password) {
    const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const sql = `UPDATE gdxem63mnchn3886.AUTHORIZATION_T SET PASSWORD = '${newPassword}' WHERE (AUTHORIZATION_ID = '${ID}')`;
    return db.execute(sql);
  }

  static setToken(ID, token) {
    const sql = `UPDATE gdxem63mnchn3886.AUTHORIZATION_T SET TOKEN = '${token}' WHERE (AUTHORIZATION_ID = '${ID}')`;
    return db.execute(sql);
  }

  static comparePassword(enteredPassword, existingPassword) {
    return bcrypt.compareSync(enteredPassword, existingPassword);
  }
}

module.exports = User;
