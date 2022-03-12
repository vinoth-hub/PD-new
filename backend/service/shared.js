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
    }, 
    download: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`select currentfolder, rootpath from ${req.decodedJwt.db}.filenames where pictureID=${req.query.pictureID}`);
            let reqPath = path.join(__dirname, `${rows[0].rootpath}/${rows[0].currentfolder}/${req.query.pictureID}.pdf`);
            reqPath = reqPath.replace('*', '') // TO-DO: Clarify this
            res.sendFile(reqPath)
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) conn.release(); 
        }
    },
    updateNote: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            if(req.body.notesID)
                await conn.query(`update ${req.decodedJwt.db}.notes set note = '${req.body.note}' where notesID = ${req.body.notesID} and pictureID=${req.body.pictureID}`) // picture ID in where clause for security
            else
                await conn.query(`insert into ${req.decodedJwt.db}.notes (pictureID, note, userID) values (${req.body.pictureID}, ${req.body.note}, ${req.decodedJwt.userId})`)
            res.sendStatus(201);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) conn.release(); 
        }
    }
}