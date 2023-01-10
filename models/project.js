const db = require("../config/db");

class Project {
  constructor(ID, ID_DEP_CLIENT, ID_PROJECT) {
    this.ID = ID;
    this.ID_DEP_CLIENT = ID_DEP_CLIENT;
    this.ID_PROJECT = ID_PROJECT;
  }

  static getAll() {
    const sql = "SELECT * FROM PROJECT_NUM_T";

    return db.execute(sql);
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
