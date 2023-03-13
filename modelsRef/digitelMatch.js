const db = require("../config/db");

const { digitalMatchTableName: tableName } = require("./sqlTableNames");

class DigitalMatch {
  static async getNumberBySymbol(symbol) {
    const sql = `SELECT PI_NUMBER as number
    FROM ${tableName}
    WHERE PI_LETTER = '${symbol}'`;

    const [[result], _] = await db.execute(sql);

    return result;
  }
}

module.exports = DigitalMatch;
