var jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
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
            var decodedJwt = { // HMAC SHA256
                userId: user.userID,
                companyId: user.defaultcompany,
                tenantId: folders[0].tenantID,
                db: db
            };
            var token = jwt.sign(decodedJwt, secret);
            req.loginResult = {
                token: token,
                defaultcompany: user.defaultcompany,
                userFullName: user.fullname
            }
            req.decodedJwt = decodedJwt
            next();
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    },
    decodeJwt: (req, res, next) => {
        if(req.decodedJwt){
            next();
            return;
        }
        let token = req.headers.authorization;
        if(!token || !token.length){
            res.sendStatus(401);
            return;
        }
        if(token.startsWith('Bearer'))
            token = token.split(' ')[1];
        try{
            req.decodedJwt = jwt.verify(token, secret);
            next();
        }
        catch(err){
            if(err instanceof jwt.JsonWebTokenError){
                res.sendStatus(401);
                return
            }
            helpers.handleError(res, err);
        }
    },
    authorize:{
        users: async (req, res, next) => {
            await helpers.checkAuthorization(req, res, next, 'Edit Users');
        },
        companies: async(req, res, next) => {
            await helpers.checkAuthorization(req, res, next, 'Edit Company', true);
        },
        category: async(req, res, next) => {
            await helpers.checkAuthorization(req, res, next, 'Edit Categories', true);
        },
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
            helpers.handleError(res, err);
        }
    },
    checkLastActivity: async (req, res, next) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`SELECT lastactivity FROM ${req.decodedJwt.db}.user WHERE userID = ${req.decodedJwt.userId}`)
            if(!rows.length){
                res.sendStatus(403);
                return;
            }
            if(rows[0].lastactivity){
                var now = helpers.prepareDateForMaria(new Date());
                var minsDifference = (new Date(now) - rows[0].lastactivity)/(1000 * 60);
                if(minsDifference > config.autoLogOutAfterMins){
                    res.sendStatus(401);
                    return;
                }
            }
            next();
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) return conn.end();
        }
    }
}
