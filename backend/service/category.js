let mysql = require("mysql2/promise");
const config = require("../shared/config");
const helpers = require("../shared/helpers");
const pool = mysql.createPool(config.db);

module.exports = {
  getList: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      var response = {};
      var filterClause = "";
      if (req.query.search?.length)
        filterClause = `and c.category like '%${req.query.search}%' `;
      var subQuery = `(select c.categoryID, c.category as name, c.companyID, c2.criteria, c.expiration from ${req.decodedJwt.db}.category c
            left join  ${req.decodedJwt.db}.criteria c2 on c.categoryID = c2.categoryID and c.companyID = c2.companyID where c.isdeleted = 0 and (c2.isdeleted is null or c2.isdeleted = 0) ${filterClause} )`; // TO-DO: Check for SQLi
      var query =
        `select sq.categoryid, sq.name, group_concat(sq.criteria) criteriaList, sq.expiration from ` +
        subQuery +
        `as sq where sq.companyID = ${
          req.query.selectedCompany
        } group by sq.categoryID order by sq.name limit ${
          25 * (req.query.pageNumber - 1)
        },25`;
      let [rows, fields] = await conn.query(query);
      rows.forEach((cat) => {
        cat.criteriaList = cat.criteriaList?.length
          ? cat.criteriaList.split(",")
          : cat.criteriaList;
        if (cat.criteriaList?.length > 3)
          cat.criteriaListSummary = cat.criteriaList.slice(0, 3);
      });
      response.list = rows;
      response.count = (
        await conn.query(`select count(1) as rowCount from  ${req.decodedJwt.db}.category c
            where isdeleted = 0 and companyID = ${req.query.selectedCompany} ${filterClause}`)
      )[0].rowCount;
      res.send(response);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  getSummary: async (req, res) => {
    try {
      conn = await pool.getConnection();
      var [rows, fields] = await conn.query(
        `SELECT categoryID, category as name FROM ${req.decodedJwt.db}.category WHERE isdeleted = 0 AND companyID = ${req.query.selectedCompany}`
      );
      res.send(rows);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  updateExpiration: async (req, res) => {
    try {
      conn = await pool.getConnection();
      await conn.query(`update ${req.decodedJwt.db}.category set expiration=${req.body.expiration} where categoryID=${req.body.categoryID}
            and companyID=${req.query.selectedCompany} 
            `); // company id filter for security
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  delete: async (req, res) => {
    try {
      conn = await pool.getConnection();
      await conn.query(`update ${req.decodedJwt.db}.category set isdeleted=1 where categoryID=${req.params.categoryId}
            and companyID=${req.query.selectedCompany} 
            `); // company id filter for security
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  criteriaOptions: async (req, res) => {
    try {
      conn = await pool.getConnection();
      var [rows, fields] = await conn.query(
        `select distinct c.criteria from ${req.decodedJwt.db}.criteria c where c.isdeleted = 0 and companyID=${req.query.selectedCompany} `
      );
      res.send(rows.map((row) => row.criteria));
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  updateCriteria: async (req, res) => {
    try {
      conn = await pool.getConnection();
      var [currentCriteria, fields] = await conn.query(
        `select distinct c.criteria from ${req.decodedJwt.db}.criteria c where c.isdeleted = 0 and companyID=${req.query.selectedCompany} and categoryID = ${req.body.categoryID}`
      );
      currentCriteria = currentCriteria.map((x) => x.criteria);
      var newCriteria = req.body.criteriaList?.map((list) => list?.criteria);
      for (var item of currentCriteria) {
        if (!newCriteria.includes(item))
          // TO-DO: Check for soft deleted ones?
          await conn.query(
            `update ${req.decodedJwt.db}.criteria set isdeleted = 1 where companyID=${req.query.selectedCompany} and categoryID = ${req.body.categoryID} and criteria='${item}'`
          );
      }
      for (var item of req.body.criteriaList) {
        if (!currentCriteria.includes(item?.criteria))
          await conn.query(`INSERT INTO demo36.criteria
                    (companyID, categoryID, criteria, datatype, orderby, lookup, display, isdeleted)
                    VALUES(${req.query.selectedCompany}, ${req.body.categoryID}, '${item?.criteria}', '${item?.type}', 1, 0, 1, 0);`);
      }

      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  editCategory: async (req, res) => {
    try {
      conn = await pool.getConnection();
      await conn.query(
        `UPDATE ${req.decodedJwt.db}.category SET category = '${req.body.name}', expiration = ${req.body.expiration} WHERE categoryID = ${req.body.categoryID} AND companyID = ${req.query.selectedCompany}`
      );
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  addCategory: async (req, res) => {
    try {
      conn = await pool.getConnection();
      var [result, fields] =
        await conn.query(`INSERT INTO ${req.decodedJwt.db}.category
            (companyID, category, isdeleted, expiration)
            VALUES(${req.query.selectedCompany}, '${req.body.name}', 0, ${req.body.expiration});
            `);
      if (req.body.sourceCategoryID > 0) {
        await conn.query(`
                INSERT INTO ${req.decodedJwt.db}.criteria(
                    companyID,
                    categoryID,
                    criteria,
                    datatype,
                    orderby,
                    lookup,
                    display,
                    isdeleted)
                SELECT
                    ${req.query.selectedCompany},
                    ${result.insertId},
                    criteria,
                    datatype,
                    orderby,
                    lookup,
                    display,
                    isdeleted
                FROM 
                    ${req.decodedJwt.db}.criteria 
                WHERE 
                    companyID = ${req.query.selectedCompany} AND
                    categoryID = ${req.body.sourceCategoryID};
                `);
      }
      res.send(result);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
};
