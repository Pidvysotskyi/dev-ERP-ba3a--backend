const db = require("../config/db");

class Position {
  //   constructor({  }) {

  //   }

  static async getAll() {
    const sql = `SELECT
    EE_EMPLOYEE_POSITION_ID AS "positionId",
    EE_NAME_POSITION AS "positionName"
    FROM gdxem63mnchn3886.EE_EMPLOYEE_TYPE_T`;

    const [result, _] = await db.execute(sql);

    return result;
  }
}

module.exports = Position;
