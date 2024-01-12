let mysql = require("mysql2/promise");
const config = require("../shared/config");
const helpers = require("../shared/helpers");
const pool = mysql.createPool(config.db);

module.exports = {
  getTimezoneList: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      var [zones, fields] = await conn.query(
        `SELECT DISTINCT fullname FROM ${req.decodedJwt.db}.timezones ORDER BY fullname`
      );
      res.send(zones);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  getList: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      var filterClause = "";
      if (req.query.search?.length)
        filterClause = `and name like '%${req.query.search}%'`;
      var [rows, fields] = await conn.query(
        `SELECT companyID, name, timezone, ip, dst FROM ${
          req.decodedJwt.db
        }.company where isdeleted = 0 ${filterClause} limit ${
          25 * (req.query.pageNumber - 1)
        },25`
      );
      var [count, fields] = await conn.query(
        `SELECT COUNT(1) AS rowCount FROM ${req.decodedJwt.db}.company where isdeleted = 0 ${filterClause}`
      );
      res.send({
        list: rows,
        count: count[0].rowCount,
      });
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  details: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      var [rows, fields] = await conn.query(
        `SELECT * FROM ${req.decodedJwt.db}.company WHERE companyID = ${req.params.companyId} AND isdeleted = 0`
      );
      res.send(rows);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  setTimezone: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        `UPDATE ${req.decodedJwt.db}.company SET timezone = '${req.body.timezone}' WHERE companyID = ${req.body.companyId}`
      );
      res.send(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  setDst: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        `UPDATE ${req.decodedJwt.db}.company SET dst = '${req.body.dst}' WHERE companyID = ${req.body.companyId}`
      );
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  delete: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(
        `UPDATE ${req.decodedJwt.db}.company SET isdeleted = 1 WHERE companyID = ${req.params.companyId}`
      );
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  edit: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE ${req.decodedJwt.db}.company SET 
                dst = ${req.body.dst},
                ip = '${req.body.ip}',
                name = '${req.body.name}',
                timezone = '${req.body.timezone}'
            WHERE companyID = ${req.body.companyID}`);
      res.sendStatus(204);
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  create: async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      if (!req.body.copyFromId) {
        console.log(req.body);
        await conn.query(`INSERT INTO demo36.company(
                    name,
                    timezone,
                    url,
                    parent,
                    dst,
                    isdeleted,
                    rootpath,
                    ip)
                VALUES(
                    '${req.body.name}',
                    '${req.body.timezone}',
                    '',
                    '1',
                    ${req.body.dst}, 
                    0, 
                    '/mnt/fsc-*/36',
                    '${req.body.ip}');
                `);
      } else {
        var result = await conn.query(`
                    INSERT INTO ${req.decodedJwt.db}.company(
                        name,
                        timezone,
                        url,
                        parent,
                        dst,
                        isdeleted,
                        rootpath,
                        ip)
                    SELECT
                        '${req.body.name}',
                        timezone,
                        '',
                        '1',
                        dst, 
                        0, 
                        '/mnt/fsc-*/36',
                        ip
                    FROM 
                        ${req.decodedJwt.db}.company 
                    WHERE 
                        companyID = ${req.body.copyFromId};
                `);
        await conn.query(`
                INSERT INTO ${req.decodedJwt.db}.category(
                    companyID,
                    category,
                    isdeleted,
                    expiration)
                SELECT
                    '${result.insertId}',
                    category,
                    isdeleted,
                    expiration
                FROM 
                    ${req.decodedJwt.db}.category 
                WHERE 
                    companyID = ${req.body.copyFromId};
                `);
      }
      res.sendStatus(201);
    } catch (err) {
      console.log("err: ", err);
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
};
