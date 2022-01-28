const mariadb = require('mariadb');
const config = require('../shared/config');
const pool = mariadb.createPool(config.db);

module.exports = {
    getCompanyList: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            let rows = await conn.query(`SELECT companyID, name FROM ${req.decodedJwt.db}.company`);
            res.send(rows);
        }
        catch(err){
            res.sendStatus(500);
        }
        finally{
            if(conn)
                conn.end();
        }
    }
}