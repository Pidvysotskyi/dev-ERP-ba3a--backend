const mysql = require("mysql2");

const { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD } = require("../config");

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
});

module.exports = pool.promise();
