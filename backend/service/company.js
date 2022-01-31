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
    },
    setTimezone: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.company SET timezone = '${req.body.timezone}' WHERE companyID = ${req.body.companyId}`);
            res.send(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    },
    setDst: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.company SET dst = '${req.body.dst}' WHERE companyID = ${req.body.companyId}`);
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) 
                conn.end();
        }
    },
    delete: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.company SET isdeleted = 1 WHERE companyID = ${req.params.companyId}`);
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) 
                conn.end();
        }
    },
    edit: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.company SET 
                dst = ${req.body.dst},
                ip = '${req.body.ip}',
                name = '${req.body.name}',
                timezone = '${req.body.timezone}'
            WHERE companyID = ${req.body.companyID}`);
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) 
                conn.end();
        }
    },
    create: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            if(req.body.copyFromId <= 0){
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
                    '${req.body.company.name}',
                    '${req.body.company.timezone}',
                    '',
                    '1',
                    ${req.body.company.dst}, 
                    0, 
                    '/mnt/fsc-*/36',
                    '${req.body.company.ip}');
                `)
            }
            else{
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
                        '${req.body.company.name}',
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
                `)
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
                `)
            }
            res.sendStatus(201);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) 
                conn.end();
        }
    }
}