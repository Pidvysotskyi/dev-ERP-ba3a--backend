const db = require("../config/db");

const { User } = require("../models");
const { addLeadingZeroes } = require("../modifiers");

const { economicAccTableName: tableName } = require("./sqlTableNames");
const { getNumericCode } = require("../helpers");
const cdigit = require("cdigit");
const algo = cdigit.mod97_10;

class EconomicAcc {
  constructor({ clientKey, countryCode, userId, groupCode, balanceCode, departmentCode, reserveCode = "00", cityCode, respCode, currencyCode, accName }) {
    this.client = clientKey;
    this.user = userId;
    this.countryCode = countryCode;
    this.ballanceCode = balanceCode;
    this.groupCode = groupCode;
    this.departmentCode = departmentCode;
    this.reserveCode = reserveCode;
    this.cityCode = cityCode;
    this.respCode = respCode;
    this.currencyCode = currencyCode;
    this.name = accName;
  }

  static baseQueries = {
    selectAnnex: `SELECT
                *
                FROM ${tableName}`,
    selectArray: `SELECT
                *
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
    const { selectAnnex } = this.baseQueries;

    const sqlCondition = `WHERE LB_APP_KP_ID = '${id}'`;

    const sql = [selectAnnex, sqlCondition].join(" ");

    const [[result], _] = await db.execute(sql);

    return result;
  }

  async newId() {
    const sql = `SELECT PB_ACCOUNT_ID AS id
    FROM ${tableName}`;

    const [ids, _] = await db.execute(sql);

    const idArray = ids.map(item => parseInt(item.id, 10));

    const result = ids.length === 0 ? 1 : Math.max(...idArray) + 1;

    const newId = addLeadingZeroes(result, 7);

    return newId;
  }

  async add() {
    const accountId = await this.newId();
    console.log(accountId, "new Id");

    const contryCodeNumber = await getNumericCode(this.countryCode);
    const groupCodeNumber = await getNumericCode(this.groupCode);
    const departmentCodeNumber = await getNumericCode(this.departmentCode);
    const reserveCodeNumber = await getNumericCode(this.reserveCode);

    const basicNumber = [this.ballanceCode, groupCodeNumber, departmentCodeNumber, reserveCodeNumber, this.cityCode, accountId, this.respCode, this.currencyCode, contryCodeNumber, "00"].join("");

    const checkSum = algo.compute(basicNumber);
    console.log(checkSum, "generated check sum");

    const { orgStructure } = await User.getOrgStructure(this.user);

    const sql = `INSERT INTO ${tableName}
    (JA_SHORT_COUNTRY_NAME, PA_BALANCE_SHEET_ACCOUNTS, PB_CHECK_NUMBER, PC_VERTICAL_GROUP_TYPE1, PD_DEPARTAMENT, PB_NN, EA_CITY_CODE, PB_ACCOUNT_ID, PF_FINANCIAL_RESPONSIBILITY_ID, JC_CURRENCY_ID, DA_EMPLOYEE_ID, PB_DATE_CREATION, PB_DATE_MODI, PB_MODIFIER, CLIENT, PB_OPEN_BALANCE_DEBIT, PB_OPEN_BALANCE_CREDIT, PB_BAALNCE_DEBIT, PB_BALANCE_CREDIT, PB_OUT_BALANCE_DEBIT, PB_OUT_BALANCE_CREDIT, PB_NAME_BALANCE, EA_ORG_STRUCTURE_IN, PB_FULL_ACCECOACTIVITY)
    VALUES
    ('${this.countryCode}', '${this.ballanceCode}', '${checkSum}', '${this.groupCode}', '${this.departmentCode}', '${this.reserveCode}', '${this.cityCode}', '${accountId}', '${this.respCode}', '${this.currencyCode}', '${this.user}', CURRENT_DATE(), CURRENT_DATE(), '${this.user}', '${this.client}', '0', '0', '0', '0', '0', '0', '${this.name}', '${orgStructure}', CONCAT(JA_SHORT_COUNTRY_NAME, PA_BALANCE_SHEET_ACCOUNTS, PB_CHECK_NUMBER, PC_VERTICAL_GROUP_TYPE1, PD_DEPARTAMENT, PB_NN, EA_CITY_CODE, PB_ACCOUNT_ID, PF_FINANCIAL_RESPONSIBILITY_ID, JC_CURRENCY_ID))`;
    const [result, _] = await db.execute(sql);
    console.log(result);
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

module.exports = EconomicAcc;
