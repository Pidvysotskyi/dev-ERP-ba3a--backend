const db = require("../config/db");

const { orgStructureTableName: tableName } = require("./sqlTableNames");

class OrgStructure {
  static async getAll() {
    const sql = `SELECT * FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }

  static async getById(ID) {
    const sql = `SELECT * FROM ${tableName} WHERE EA_ORG_STRUCTURE_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }

  static async getShortNameById(ID) {
    const sql = `SELECT EA_SHORT_NAME_ORG AS shortName FROM ${tableName} WHERE EA_ORG_STRUCTURE_IN = '${ID}'`;

    const [[result], _] = await db.execute(sql);

    if (!result) {
      return null;
    }

    return result.shortName;
  }
}

module.exports = OrgStructure;
