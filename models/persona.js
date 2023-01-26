const db = require("../config/db");
const { transliteration } = require("../modifiers");

class Persona {
  constructor({ firstName, lastName, patronym, user }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.patronym = patronym;
    this.user = user;
  }

  static async getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.CA_PERSONA_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.CA_PERSONA_T WHERE CA_PERSONA_ID = '${ID}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT CA_PERSONA_ID AS id
    FROM gdxem63mnchn3886.CA_PERSONA_T`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    const result = Math.max(...idArray) + 1;

    return result;
  }

  async add() {
    const id = await this.newId();
    const date = new Date();
    const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const fullName = this.patronym ? [this.firstName, this.patronym, this.lastName].join(" ") : [this.firstName, this.lastName].join(" ");
    const engFirstName = transliteration(this.firstName);
    const engLastName = transliteration(this.lastName);
    const sql = `INSERT INTO gdxem63mnchn3886.CA_PERSONA_T
        (CA_PERSONA_ID, CA_CREATOR, CA_DATE_CREATION, CA_MODIFIER, CA_DATE_MODI, CA_FIRST_NAME, CA_LAST_NAME, CA_PATRONYM, CA_FULL_NAME, CA_FIRST_NAME_ENG, CA_LAST_NAME_ENG)
        VALUES('${id}', '${this.user}', '${creationDate}', '${this.user}', '${creationDate}', '${this.firstName}', '${this.lastName}', '${this.patronym}', '${fullName}', '${engFirstName}', '${engLastName}')`;
    await db.execute(sql);
    return id;
  }
}

module.exports = Persona;
