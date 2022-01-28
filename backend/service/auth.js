var jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const config = require('../shared/config');
const pool = mariadb.createPool(config.db);
const secret = config.jwtEncodingSecret;
module.exports = {
    login: async(req, res, next) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var folders = await conn.query('SELECT dbName,tenantID FROM master.tenantfolders WHERE tenantID = (SELECT tenantID FROM master.tenant WHERE tenantName = ?)',[req.body.tenantName])
            if(!folders?.length){
                res.status(401);
                res.send('Unknown tenant')
                return;
            }
            var db = folders[0].dbName;
            var rows = await conn.query(`SELECT * FROM ${db}.user WHERE username=? AND isActive=1 AND isDeleted=0`,[req.body.username]);
            if(!rows.length){
                res.status(401);
                res.send('No account found')
                return;
            }
            var user = rows[0];
            if(!bcrypt.compareSync(req.body.password, user.password)){
                res.status(401);
                res.send('Wrong password')
                return;
            }
            var token = jwt.sign({ // HMAC SHA256
                userId: user.userID,
                companyId: user.defaultcompany,
                tenantId: folders[0].tenantID,
                db: db
            },secret);
            res.send({
                token: token,
                defaultcompany: user.defaultcompany
            });
            req.userId = user.usersID;
            next();
        }
        catch(err){
            console.error(err);
            req.sendStatus(500)
        }
        finally{
            if (conn) return conn.end();
        }
    },
    decodeJwt: (req, res, next) => {
        let token = req.headers.authorization;
        if(!token || !token.length){
            res.sendStatus(401);
            return;
        }
        if(token.startsWith('Bearer'))
            token = token.split(' ')[1];
        let conn;
        try{
            req.decodedJwt = jwt.verify(token, secret);
            next();
        }
        catch(err){
            res.sendStatus(500);
        }
        finally{
            if (conn) return conn.end();
        }
    },
    authorize:{
        users: async (req, res, next) => {
            let conn;
            try{
                conn = await pool.getConnection();
                var rows = await conn.query(`select count(1) from ${req.decodedJwt.db}.transsecurity t 
                inner join ${req.decodedJwt.db}.\`security\` s on t.securityID = s.securityID and t.companyID = s.companyID 
                where t.userID  = ${req.decodedJwt.userId} and t.companyID = ${req.query.selectedCompany} and \`level\` = 'Edit Users'`)
                if(!rows || !rows[0]){
                    res.sendStatus(403);
                    return;
                }
                next();
            }
            catch(err){
                res.sendStatus(500);
            }
            finally{
                if (conn) return conn.end();
            }
        }
    },
    generatePassword: async(req, res, next) => {
        try{
            req.newPassword = {};
            var password = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=[]{}|;,.<>?`~';
            var charactersLength = characters.length;
            while(password.length < 10)
                password += characters.charAt(Math.floor(Math.random() * charactersLength));
            req.newPassword.password = password;
            req.newPassword.hash = await bcrypt.hash(password,0);
            next();
        }
        catch(err){
            res.sendStatus(500);
        }
    }
}
