const mariadb = require('mariadb');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mariadb.createPool(config.db);

module.exports = {
    getTimezoneList: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var zones = await conn.query(`SELECT DISTINCT fullname FROM ${req.decodedJwt.db}.timezones ORDER BY fullname`);
            res.send(zones);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    },
    getList: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`SELECT companyID, name, timezone, ip, dst FROM ${req.decodedJwt.db}.company limit ${3 * (req.query.pageNumber - 1)},3`);
            var count = await conn.query(`SELECT COUNT(1) AS rowCount FROM ${req.decodedJwt.db}.company`)
            res.send({
                list: rows,
                count: count[0].rowCount
            });
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    }, 
    getSummary: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`SELECT companyID, name FROM ${req.decodedJwt.db}.company WHERE isdeleted = 0 ORDER BY name `);
            res.send(rows);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    },
    details: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`SELECT * FROM ${req.decodedJwt.db}.company WHERE companyID = ${req.params.companyId} AND isdeleted = 0`);
            res.send(rows);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    }
}