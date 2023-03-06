const db = require("../config/db");

const { todoKpTableName: tableName } = require("./sqlTableNames");

class TodoKp {
  constructor({ kpKey, dueDate, userId, todoNote }) {
    this.user = userId;
    this.kp = kpKey;
    this.dueDate = dueDate;
    this.note = todoNote;
  }

  static baseQueries = {
    selectTodo: `SELECT
    GR_TO_DO_KP_ID as 'todoId',
    GA_KP_N as "kpKey",
    GR_NOTE_KP as 'todoNote',
    GR_DATE_CREATION as 'creationDate',
    GR_DATE_D_DAY as 'dueDate'
    FROM ${tableName}`,
    selectArray: `SELECT
    GR_TO_DO_KP_ID as 'todoId',
    GA_KP_N as "kpKey",
    GR_NOTE_KP as 'todoNote',
    GR_DATE_CREATION as 'creationDate',
    GR_DATE_D_DAY as 'dueDate'
    FROM ${tableName}`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForUser(userId) {
    const sqlCondition = `WHERE DA_EMPLOYEE_ID = '${userId}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectTodo } = this.baseQueries;

    const sqlCondition = `WHERE GR_TO_DO_KP_ID = '${id}'`;

    const sql = [selectTodo, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const sql = `INSERT INTO ${tableName}
    (GA_KP_N, DA_EMPLOYEE_ID, GR_NOTE_KP, GR_DATE_CREATION, GR_DATE_D_DAY, GR_MODIFIER, GR_DATE_MODI)
    VALUES 
    ('${this.kp}', '${this.user}', '${this.note}', CURRENT_DATE(), '${this.dueDate}', '${this.user}', CURRENT_DATE())`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const sql = `UPDATE ${tableName}
    SET
    GR_NOTE_KP = '${this.note}',
    GR_MODIFIER = '${this.user}',
    GR_DATE_MODI = CURRENT_DATE()
    WHERE (GR_TO_DO_KP_ID = '${id}')`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = TodoKp;
