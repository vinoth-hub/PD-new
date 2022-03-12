let mysql = require('mysql2/promise');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mysql.createPool(config.db);
var path = require('path');

module.exports = {
    quickSearch: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var query = `select c.category,p.pictureID, p.itemdate as pictureDate, u.username, d.itemdate as dnchDate, n.notesID, n.note from ${req.decodedJwt.db}.picture p 
            left join ${req.decodedJwt.db}.history h on p.pictureID  = h.pictureID and p.companyID = h.companyID
            left join ${req.decodedJwt.db}.dnch d on d.historyID = h.historyID and d.categoryID = h.categoryID 
            left join ${req.decodedJwt.db}.category c on d.categoryID = c.categoryID 
            left join ${req.decodedJwt.db}.\`user\` u on u.userID = h.userID
            left join ${req.decodedJwt.db}.notes n on p.pictureID = n.pictureID
            where d.criteriaTXT like '%${req.query.searchQuery}%' and p.companyID = ${req.query.selectedCompany}`
            var [rows, fields] = await conn.query(query);
            res.send(rows);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) conn.release(); 
        }
    }
}