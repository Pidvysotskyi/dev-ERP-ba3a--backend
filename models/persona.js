const db = require("../config/db");
const { transliteration } = require("../modifiers");

class Persona {
  constructor({ id, firstName, lastName, surName, user }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.surName = surName;
    this.user = user;
  }

  static async getAll() {
    const sql = "SELECT * FROM gdxem63mnchn3886.CA_PERSONA_T;";

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.CA_PERSONA_T where CA_PERSONA_ID = '${ID}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  add() {
    const date = new Date();
    const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const fullName = [this.firstName, this.surName, this.lastName].join(" ");
    const engFirstName = transliteration(this.firstName);
    const engLastName = transliteration(this.lastName);
    const sql = `INSERT INTO gdxem63mnchn3886.CA_PERSONA_T
        (CA_PERSONA_ID, CA_DATE_CREATION, CA_DATE_MODI, CA_FIRST_NAME, CA_SECOND_NAME, CA_SUR_NAME, CA_FULL_NAME, CA_FIRST_NAME_ENG, CA_SUR_NAME_ENG)
        VALUES('${this.id}', '${creationDate}', '${creationDate}', '${this.firstName}', '${this.lastName}', '${this.surName}', '${fullName}', '${engFirstName}', '${engLastName}')`;

    return db.execute(sql);
  }
}

module.exports = Persona;
