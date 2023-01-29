const db = require("../config/db");

class Client {
  constructor({ personaId, orgStructureId, creatorId }) {
    this.personaId = personaId;
    this.orgStructureId = orgStructureId;
    this.creator = creatorId;
  }

  static async getAll() {
    const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T where DC_CLIENT_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async findbyPersona(id) {
    const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T WHERE CA_PERSONA_ID = '${id}'`;
    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT DC_CLIENT_IN AS id
    FROM gdxem63mnchn3886.DC_CLIENT_T`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => item.id);

    console.log(idArray, "Масив айдішок");

    const result = idArray.length === 0 ? 1 : Math.max(...idArray) + 1;

    console.log(result, "Готова айдішка");

    return result;
  }

  async add() {
    const id = await this.newId();
    console.log(id, "Записана айдішка");
    const date = new Date();
    const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
    const sql = `INSERT INTO gdxem63mnchn3886.DC_CLIENT_T
    (DC_CLIENT_IN, CA_PERSONA_ID, EA_ORG_STRUCTURE_IN, DC_CREATOR, DC_DATA_CREATION, DC_MODIFIER, DC_DATE_MODI)
    VALUES ('${id}', '${this.personaId}', '${this.orgStructureId}', '${this.creator}', '${creationDate}', '${this.creator}', '${creationDate}');`;
    await db.execute(sql);
    return id;
  }
}

module.exports = Client;
