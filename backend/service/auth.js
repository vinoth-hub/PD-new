var jwt = require('jsonwebtoken');
let mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mysql.createPool(config.db);
const secret = config.jwtEncodingSecret;
module.exports = {
    login: async(req, res, next) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var [folders, fields] = await conn.query('SELECT dbName,tenantID FROM master.tenantfolders WHERE tenantID = (SELECT tenantID FROM master.tenant WHERE tenantName = ?)',[req.body.tenantName])
            if(!folders?.length){
                res.status(401);
                res.send('Unknown tenant')
                return;
            }
            var db = folders[0].dbName;
            var [rows, fields] = await conn.query(`SELECT * FROM ${db}.user WHERE username=? AND isActive=1 AND isDeleted=0`,[req.body.username]);
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
                userFullName: user.fullname,
                userId: user.userID
            }
            req.decodedJwt = decodedJwt
            next();
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if (conn) conn.release()
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
            await helpers.checkAuthorization(req, res, next, 'Edit Company', []);
        },
        category: async(req, res, next) => {
            await helpers.checkAuthorization(req, res, next, 'Edit Categories');
        },
        common: (req, res, next) => {
            if(!req.decodedJwt){
                res.sendStatus(403);
                return;
            }
            next();
        },
        search:{
            generic: async(req, res, next) => {
                if(!req.searchPreAuthorization || !req.searchPreAuthorization.some(x => x.companyID.toString() === req.query.selectedCompany)){
                    res.sendStatus(403);
                    return;
                }
                next();
            },
            specific: async (req, res, next) => {
                var requestedPictureId = req.query.pictureID;
                if(!requestedPictureId)
                    requestedPictureId = req.body.pictureID;
                let conn;
                try{
                    conn = await pool.getConnection();
                    var [rows, fields] = await conn.query(`
                        select c.categoryID, p.companyID from ${req.decodedJwt.db}.picture p 
                        left join ${req.decodedJwt.db}.history h on p.pictureID  = h.pictureID and p.companyID = h.companyID
                        left join ${req.decodedJwt.db}.dnch d on d.historyID = h.historyID and d.categoryID = h.categoryID 
                        left join ${req.decodedJwt.db}.category c on d.categoryID = c.categoryID 
                        where p.pictureID = ${requestedPictureId}`);
                    if(!rows || !rows.length){
                        res.sendStatus(404);
                        return; 
                    }
                    if(!req.searchPreAuthorization.some(x => x.companyID === rows[0].companyID && x.categoryID === rows[0].categoryID)){
                        res.sendStatus(403);
                        return;
                    }
                    next();
                }
                catch(err){
                    helpers.handleError(res, err);
                }
                finally{
                    if (conn) conn.release()
                }
            }
        }
    },
    preAuthorize: {
        search: async(req, res, next) => {
            let conn;
            try{
                conn = await pool.getConnection();
                var [rows, fields] = await conn.query(`select t.companyID, t.categoryID, c.category from ${req.decodedJwt.db}.transsecurity t
                inner join ${req.decodedJwt.db}.category c on t.categoryID = c.categoryID and t.companyID = c.companyID where t.companyID in 
                (select t1.companyID from ${req.decodedJwt.db}.transsecurity t1 
                inner join ${req.decodedJwt.db}.\`security\` s on s.securityID  = t1.securityID and s.companyID  = t1.companyID 
                where t1.userID = ${req.decodedJwt.userId} and s.\`level\` = 'Search')
                order by t.companyID `)
                req.searchPreAuthorization = rows;
                next();
            }
            catch(err){
                helpers.handleError(res, err);
            }
            finally{
                if (conn) conn.release()
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
            helpers.handleError(res, err);
        }
    },
    checkLastActivity: async (req, res, next) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`SELECT lastactivity FROM ${req.decodedJwt.db}.user WHERE userID = ${req.decodedJwt.userId}`)
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
            if (conn) conn.release(); 
        }
    }
}
