const mariadb = require('mariadb');
const config = require('../shared/config');
const pool = mariadb.createPool(config.db);

module.exports = {
    getAccessList: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            let rows = await conn.query("SELECT * FROM master.access");
            res.send(rows);
        }
        catch(err){
            res.sendStatus(500);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    userList: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var response = {};
            var subQuery = `(select u.username, u.userID, c.category, s.level, u.ip, u.title
            from ${req.decodedJwt.db}.user u left join ${req.decodedJwt.db}.transsecurity t on u.userID = t.userID
            inner join ${req.decodedJwt.db}.company c2 on c2.companyID = t.companyID 
            left join ${req.decodedJwt.db}.security s on t.securityID = s.securityID and t.companyID = s.companyID 
            left join ${req.decodedJwt.db}.category c on t.categoryID = c.categoryID and t.companyID = c.companyID 
            where c2.companyID = ${req.query.selectedCompany} and u.isDeleted = 0)`; // TO-DO: Check for SQLi
            var query = `select sq.username, sq.userID, group_concat(sq.category) as categoryList, group_concat(sq.level)as levelList, sq.ip, sq.title from `
            + subQuery + 
            `as sq group by sq.userID order by sq.userID limit ${3 * (req.query.pageNumber - 1)},3`
            let rows = await conn.query(query);
            rows.forEach((user)=>{
                user.categoryList = user.categoryList?.length ? user.categoryList.split(',') : user.categoryList
                user.levelList = user.levelList?.length ? user.levelList.split(',') : user.levelList
                if(user.categoryList?.length > 3)
                    user.categoryListSummary = user.categoryList.slice(0, 3)
                if(user.levelList?.length > 3)
                    user.levelListSummary = user.levelList.slice(0, 3)
            })
            response.userList = rows;
            response.count = (await conn.query(`select count(1) as rowCount from  ${req.decodedJwt.db}.\`user\` u where 
                exists (select * from ${req.decodedJwt.db}.transsecurity t where t.userID = u.userID and t.companyID = ${req.query.selectedCompany})
                and u.isDeleted = 0`))[0].rowCount
            res.send(response);
        }
        catch(err){
            res.status(500);
            res.send(err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    deleteUser: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.\`user\` set isDeleted = 1 where userID = ?`, [req.params.userId])
            res.sendStatus(204);
        }
        catch(err){
            res.status(500);
            res.send(err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    deactivateUser: async(req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.\`user\` set isActive = 0 where userID = ?`, [req.params.userId])
            res.sendStatus(204);
        }
        catch(err){
            res.status(500);
            res.send(err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    setPassword: async(req, res, next) => {
        var conn;
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.\`user\` SET password=? WHERE userID=?`,[req.newPassword.hash, req.body.userId]);
            next();
        }
        catch(err){
            res.sendStatus(500);
        }
        finally{
            if (conn) return conn.end();
        }
    },
}