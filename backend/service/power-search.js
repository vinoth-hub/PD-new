let mysql = require('mysql2/promise');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mysql.createPool(config.db);
var path = require('path');

module.exports = {
    getUniqueCategories: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`select distinct category as categoryName from ${req.decodedJwt.db}.category`);
            var result = rows.map(x => x.categoryName)
            res.send(result);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) conn.release(); 
        }
    },
    doSearch: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var companyWiseSearchFilters = [];
            for(var item of req.searchPreAuthorization){
                if(!req.body.selectedCompanies.some(x => x === item.companyID) || !req.body.selectedCategories.some(x => x === item.category)) // User has not chosen filter
                    continue;
                var index = companyWiseSearchFilters.findIndex(x => x.companyID === item.companyID)
                if(index === -1)
                    companyWiseSearchFilters.push({companyID: item.companyID, categoryIds: [item.categoryID]})
                else if(!companyWiseSearchFilters[index].categoryIds.some(x => x === item.categoryID))
                    companyWiseSearchFilters[index].categoryIds.push(item.categoryID);
            }
            var query = '';
            for(var item of companyWiseSearchFilters){
                query += `select c.category,p.pictureID, p.itemdate as pictureDate, u.username, d.itemdate as dnchDate, n.notesID, n.note from ${req.decodedJwt.db}.picture p 
                    left join ${req.decodedJwt.db}.history h on p.pictureID  = h.pictureID and p.companyID = h.companyID
                    left join ${req.decodedJwt.db}.dnch d on d.historyID = h.historyID and d.categoryID = h.categoryID 
                    left join ${req.decodedJwt.db}.category c on d.categoryID = c.categoryID 
                    left join ${req.decodedJwt.db}.\`user\` u on u.userID = h.userID 
                    left join ${req.decodedJwt.db}.notes n on p.pictureID = n.pictureID
                    where d.criteriaTXT like '%${req.body.searchQuery}%' and p.companyID = ${item.companyID} and c.categoryID in (${item.categoryIds.toString()}) union `
            }
            query = query.substring(0, query.length - 6)
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