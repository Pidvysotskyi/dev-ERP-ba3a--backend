const db = require("../config/db");

const { positionTableName: tableName } = require("./sqlTableNames");

class Position {
  //   constructor({  }) {

  //   }

  static async getAll() {
    const sql = `SELECT
    EE_EMPLOYEE_POSITION_ID AS "positionId",
    EE_NAME_POSITION AS "positionName"
    FROM ${tableName}`;

    const [result, _] = await db.execute(sql);

    return result;
  }
}

module.exports = Position;
