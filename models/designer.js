const db = require("../config/db");

const { designerTableName: tableName } = require("./sqlTableNames");

class Designer {
  constructor({ personaId, orgStructure, creatorId }) {
    this.personaId = personaId;
    this.orgStructure = orgStructure;
    this.creator = creatorId;
  }

  static async getAll() {
    const sql = `SELECT
    DD_DESIGNER_ID AS "designerId",
    DD_DESIGNER_NAME AS "designerName",
    DD_AGENT_BONUS AS "designerBonus",
    DD_NOTE AS "designerNote"
    FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  // static async getById(ID) {
  //   const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T where DC_CLIENT_IN = '${ID}'`;

  //   const [[result], _] = await db.execute(sql);

  //   return result;
  // }

  // static async findbyPersona(id) {
  //   const sql = `SELECT * FROM gdxem63mnchn3886.DC_CLIENT_T WHERE CA_PERSONA_ID = '${id}'`;
  //   const [[result], _] = await db.execute(sql);

  //   return result;
  // }

  // async add() {
  //   const id = [this.orgStructure, this.personaId].join("-");
  //   const date = new Date();
  //   const creationDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
  //   const sql = `INSERT INTO gdxem63mnchn3886.DC_CLIENT_T
  //   (DC_CLIENT_IN, CA_PERSONA_ID, DC_CREATOR, DC_DATA_CREATION, DC_MODIFIER, DC_DATE_MODI)
  //   VALUES ('${id}', '${this.personaId}', '${this.creator}', '${creationDate}', '${this.creator}', '${creationDate}');`;
  //   await db.execute(sql);
  //   return id;
  // }
}

module.exports = Designer;
