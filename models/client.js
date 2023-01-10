const db = require("../config/db");

class Client {
  constructor(ID_DEP_CLIENT, NAME_CLIENT) {
    this.ID_DEP_CLIENT = ID_DEP_CLIENT;
    this.NAME_CLIENT = NAME_CLIENT;
  }

  static getAll() {
    const sql = "SELECT * FROM CLIENT_T";

    return db.execute(sql);
  }
}

module.exports = Client;
