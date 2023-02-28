const db = require("../config/db");
const { transliteration } = require("../modifiers");
const { personaTableName: tableName } = require("./sqlTableNames");

class Persona {
  constructor({ firstName, lastName, patronym, creatorId }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.patronym = patronym;
    this.creator = creatorId;
    this.sql = "";
  }

  static async getAll() {
    const sql = `SELECT * FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM ${tableName} WHERE CA_PERSONA_ID = '${ID}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT CA_PERSONA_ID AS id
    FROM ${tableName}`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    return result;
  }

  async add() {
    const id = await this.newId();
    const fullName = this.patronym ? [this.firstName, this.patronym, this.lastName].join(" ") : [this.firstName, this.lastName].join(" ");
    const engFirstName = transliteration(this.firstName);
    const engLastName = transliteration(this.lastName);
    const patronym = this.patronym ? JSON.stringify(this.patronym) : null;

    const sql = `INSERT INTO ${tableName}
        (CA_PERSONA_ID, CA_CREATOR, CA_DATE_CREATION, CA_MODIFIER, CA_DATE_MODI, CA_FIRST_NAME, CA_LAST_NAME, CA_PATRONYM, CA_FULL_NAME, CA_FIRST_NAME_ENG, CA_LAST_NAME_ENG)
        VALUES('${id}', '${this.creator}', CURRENT_DATE(), '${this.creator}', CURRENT_DATE(), '${this.firstName}', '${this.lastName}', ${patronym}, '${fullName}', '${engFirstName}', '${engLastName}')`;

    await db.execute(sql);
    return id;
  }
}

module.exports = Persona;
