var express = require('express');
var cors = require('cors');
var auth = require('./service/auth');
var user = require('./service/user');
var common = require('./service/common');
var mailer = require('./service/mailer');
var helpers = require('./shared/helpers');
const company = require('./service/company');
var app = express();
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));

app.post('/login', auth.login, auth.decodeJwt, helpers.updateLastActivity, (req, res) => {
    res.send(req.loginResult)
})
app.get('/companies', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, (req, res, next) => {
    if(!req.decodedJwt){
        res.sendStatus(403);
        return;
    }
    next();
}, common.getCompanyList)

app.get('/user/all-access-pages', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllAccessPages);
app.get('/user/all-categories', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllCategories);
app.get('/user', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.userList);
app.get('/user/summary', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.getSummary);
app.get('/user/:userId/ts-details', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.getTsDetails);
app.delete('/user/:userId', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.deleteUser);
app.put('/user/:userId/deactivate', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.deactivateUser);
app.put('/user/:userId/force-logout', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.forceLogout);
app.put('/user/password-reset', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.setPassword, mailer.passwordReset)
app.put('/user', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.updateUser);
app.post('/user', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.createUser, mailer.newAccount, (req, res) => {
    res.sendStatus(201)
});

app.get('/company', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getList)
app.get('/company/summary', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getSummary)
app.get('/company/:companyId', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.details)
app.delete('/company/:companyId', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.delete)
app.get('/company/timezones/all', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getTimezoneList)
app.put('/company/timezone', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setTimezone)
app.put('/company/dst', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setDst)
app.put('/company', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.edit)
app.post('/company', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.create)

app.listen(port, ()=>{
    console.log('Ready on ',port)
})