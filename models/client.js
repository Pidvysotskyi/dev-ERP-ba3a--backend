const db = require("../config/db");

class Client {
  constructor(ID_DEP_CLIENT, NAME_CLIENT) {
    this.ID_DEP_CLIENT = ID_DEP_CLIENT;
    this.NAME_CLIENT = NAME_CLIENT;
  }

  static async getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }
}

module.exports = Client;
