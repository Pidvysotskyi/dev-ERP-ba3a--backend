const db = require("../config/db");

const { clientTableName: tableName } = require("./sqlTableNames");

class Client {
  constructor({ personaId, orgStructure, creatorId }) {
    this.personaId = personaId;
    this.orgStructure = orgStructure;
    this.creator = creatorId;
  }

  static async getAll() {
    const sql = `SELECT * FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM ${tableName} where DC_CLIENT_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async findbyPersona(id) {
    const sql = `SELECT * FROM ${tableName} WHERE CA_PERSONA_ID = '${id}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const id = [this.orgStructure, this.personaId].join("-");
    const sql = `INSERT INTO ${tableName}
    (DC_CLIENT_IN, CA_PERSONA_ID, DC_CREATOR, DC_DATA_CREATION, DC_MODIFIER, DC_DATE_MODI)
    VALUES ('${id}', '${this.personaId}', '${this.creator}', CURRENT_DATE(), '${this.creator}', CURRENT_DATE());`;
    await db.execute(sql);
    return id;
  }
}

module.exports = Client;
