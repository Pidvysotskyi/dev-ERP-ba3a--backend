const db = require("../config/db");

class Persona {
  constructor({ id, firstName, lastName, surName }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.surName = surName;
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
    const sql = `INSERT INTO gdxem63mnchn3886.CA_PERSONA_T
        (CA_PERSONA_ID, CA_DATE_CREATION, CA_DATE_MODI, CA_FIRST_NAME, CA_SECOND_NAME, CA_SUR_NAME, CA_FULL_NAME)
        VALUES('${this.id}', '${creationDate}', '${creationDate}', '${this.firstName}', '${this.lastName}', '${this.surName}', '${fullName}')`;

    return db.execute(sql);
  }
}

module.exports = Persona;
