const db = require("../config/db");

const { User } = require("../models");
const { addLeadingZeroes } = require("../modifiers");

const { operationalAccTableName: tableName } = require("./sqlTableNames");
const { getNumericCode } = require("../helpers");
const cdigit = require("cdigit");
const algo = cdigit.mod97_10;

class OperationalAcc {
  constructor({ personaId, clientKey, orgStructureId, countryCode, userId, balanceCode, cityCode, customerCode, currencyCode, accName }) {
    this.orgStructure = orgStructureId;
    this.persona = personaId;
    this.client = clientKey;
    this.user = userId;
    this.countryCode = countryCode;
    this.ballanceCode = balanceCode;
    this.cityCode = cityCode;
    this.customerCode = customerCode;
    this.currencyCode = currencyCode;
    this.name = accName;
  }

  static baseQueries = {
    selectAcc: `SELECT
    PY_NAME_BALANCE as accountName,
    PY_FULL_ACCOPERACTIVITY as accountNumber
    FROM ${tableName}`,
    selectArray: `SELECT
    PY_NAME_BALANCE as accountName,
    PY_FULL_ACCOPERACTIVITY as accountNumber
    FROM ${tableName}`,
  };

  static async getSpecificArray(sqlCondition) {
    const { selectArray } = this.baseQueries;
    const sql = [selectArray, sqlCondition].join(" ");
    const [kps, _] = await db.execute(sql);
    return kps;
  }

  static async getForClient(key) {
    const sqlCondition = `WHERE CLIENT = '${key}'`;
    const result = await this.getSpecificArray(sqlCondition);
    return result;
  }

  static async getByid(id) {
    const { selectAcc } = this.baseQueries;

    const sqlCondition = `WHERE (PY_ACCOUNT_ID = '${id}')`;

    const sql = [selectAcc, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT PY_ACCOUNT_ID AS id
    FROM ${tableName}`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => parseInt(item.id, 10));

    const result = ids.length === 0 ? 1 : Math.max(...idArray) + 1;

    const newId = addLeadingZeroes(result, 7);

    return newId;
  }

  async add() {
    const accountId = await this.newId();

    const contryCodeNumber = await getNumericCode(this.countryCode);

    const personaCode = addLeadingZeroes(this.persona, 6);

    const basicNumber = [this.ballanceCode, personaCode, this.cityCode, accountId, this.customerCode, this.currencyCode, contryCodeNumber, "00"].join("");

    const checkSum = algo.compute(basicNumber);

    const client = this.client ? JSON.stringify(this.client) : null;

    const sql = `INSERT INTO ${tableName}
    (JA_SHORT_COUNTRY_NAME, PA_BALANCE_SHEET_ACCOUNTS, PA_CHECK_NUMBER, PC_FFFFFF, EA_CITY_CODE, PY_ACCOUNT_ID, PC_CUSTOMER_TYPE_CODE_ID, JC_CURRENCY_ID, DA_EMPLOYEE_ID, PY_DATE_CREATION, PY_DATE_MODI, PY_MODIFIER, CLIENT, PY_OPEN_BALANCE_DEBIT, PY_OPEN_BALANCE_CREDIT, PY_BALANCE_DEBIT, PY_BALANCE_CREDIT, PY_OUT_BALANCE_DEBIT, PY_OUT_BALANCE_CREDIT, PY_NAME_BALANCE, EA_ORG_STRUCTURE_IN, PY_FULL_ACCOPERACTIVITY)
    VALUES
    ('${this.countryCode}', '${this.ballanceCode}', '${checkSum}', '${personaCode}', '${this.cityCode}', '${accountId}', '${this.customerCode}', '${this.currencyCode}', '${this.user}', '2023-03-13', '2023-03-13', '${this.user}', ${client}, '0', '0', '0', '0', '0', '0', '${this.name}', '${this.orgStructure}',CONCAT(JA_SHORT_COUNTRY_NAME, PA_BALANCE_SHEET_ACCOUNTS, PA_CHECK_NUMBER, PC_FFFFFF, EA_CITY_CODE, PY_ACCOUNT_ID, PC_CUSTOMER_TYPE_CODE_ID, JC_CURRENCY_ID));`;

    await db.execute(sql);

    return accountId;
  }

  async update(id) {
    const note = this.note ? JSON.stringify(this.note) : null;

    const sql = `UPDATE ${tableName}
                SET
                LB_NAME_APP_KP = '${this.annextName}',
                LB_NOTE = ${note},
                LB_MODIFIER = '${this.user}',
                LB_DATE_MODI = CURRENT_DATE(),
                LB_APP_KP_AMOUNT = '${this.budget}',
                LB_PATH_APP_KP = '${this.docsArray}'
                WHERE (LB_APP_KP_ID = '${id}');`;
    const result = await db.execute(sql);
    return result;
  }
}

module.exports = OperationalAcc;
