const db = require("../config/db");

class OrgStructure {
  static async getAll() {
    const sql = "SELECT * FROM gdxem63mnchn3886.EA_ORG_STRUCTURE_T";

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM gdxem63mnchn3886.EA_ORG_STRUCTURE_T WHERE EA_ORG_STRUCTURE_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    console.log(result);

    return result;
  }

  static async getShortNameById(ID) {
    const sql = `SELECT EA_SHORT_NAME_ORG AS shortName FROM gdxem63mnchn3886.EA_ORG_STRUCTURE_T WHERE EA_ORG_STRUCTURE_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    console.log(result);

    if (!result) {
      return null;
    }

    return result.shortName;
  }
}

module.exports = OrgStructure;
