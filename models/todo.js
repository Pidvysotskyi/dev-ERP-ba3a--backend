const db = require("../config/db");
const { splitProjectKey } = require("../modifiers");

const { todoTableName: tableName } = require("./sqlTableNames");

class Todo {
  constructor({ projectKey, dueDate, userId, todoNote }) {
    this.user = userId;
    this.project = projectKey;
    this.dueDate = dueDate;
    this.note = todoNote;
  }

  static baseQueries = {
    selectTodo: `SELECT
    FB_TO_DO_PROJECT_ID as 'todoId',
    FB_NOTE_PROJECT as 'todoNote',
    FB_DATE_CREATION as 'creationDate',
    FB_DATE_D_DAY as 'dueDate'
    FROM ${tableName}`,
    selectArray: `SELECT
    FB_TO_DO_PROJECT_ID as 'todoId',
    FB_NOTE_PROJECT as 'todoNote',
    FB_DATE_CREATION as 'creationDate',
    FB_DATE_D_DAY as 'dueDate'
    FROM ${tableName}`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForProject(key) {
    const { projectIn, client } = splitProjectKey(key);

    const sqlCondition = `WHERE FA_PROJECT_IN = '${projectIn}' AND DC_CLIENT_IN = '${client}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectTodo } = this.baseQueries;

    const sqlCondition = `WHERE FB_TO_DO_PROJECT_ID = '${id}'`;

    const sql = [selectTodo, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async add() {
    const { projectIn, client } = splitProjectKey(this.project);

    const sql = `INSERT INTO ${tableName}
    (FA_PROJECT_IN, DC_CLIENT_IN, DA_EMPLOYEE_ID, FB_NOTE_PROJECT, FB_DATE_CREATION, FB_DATE_D_DAY, FB_MODIFIER, FB_DATE_MODI)
    VALUES 
    ('${projectIn}', '${client}', '${this.user}', '${this.note}', CURRENT_DATE(), '${this.dueDate}', '${this.user}', CURRENT_DATE())`;
    const [result, _] = await db.execute(sql);
    return result.insertId;
  }

  async update(id) {
    const sql = `UPDATE ${tableName}
    SET
    FB_NOTE_PROJECT = '${this.note}',
    FB_MODIFIER = '${this.user}',
    FB_DATE_MODI = CURRENT_DATE()
    WHERE (FB_TO_DO_PROJECT_ID = '${id}')`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = Todo;
