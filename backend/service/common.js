let mysql = require('mysql2/promise');
const config = require('../shared/config');
const pool = mysql.createPool(config.db);

module.exports = {
    getCompanyList: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            let [rows, fields] = await conn.query(`SELECT companyID, name FROM ${req.decodedJwt.db}.company WHERE isdeleted = 0`);
            res.send(rows);
        }
        catch(err){
            res.sendStatus(500);
        }
        finally{
            if(conn)
                conn.release();
        }
    },
    broadcastLogout: (wsServer) => {
        return (req, res) => {
            wsServer.clients.forEach(client => {
                client.send(JSON.stringify({userId: req.params.userId}))
            });
            res.sendStatus(204)
        }
    }
}