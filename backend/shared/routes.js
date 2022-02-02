const auth = require('../service/auth');
const user = require('../service/user');
const common = require('../service/common');
const mailer = require('../service/mailer');
const helpers = require('../shared/helpers');
const company = require('../service/company');
const category = require('../service/category');

module.exports = {
    register:{
        common: (app) =>{
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
        },
        user:(app) => {
            const baseUrl = '/user';
            app.get(`${baseUrl}/all-access-pages`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllAccessPages);
            app.get(`${baseUrl}/all-categories`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllCategories);
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.userList);
            app.get(`${baseUrl}/summary`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.getSummary);
            app.get(`${baseUrl}/:userId/ts-details`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.getTsDetails);
            app.delete(`${baseUrl}/:userId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.deleteUser);
            app.put(`${baseUrl}/:userId/deactivate`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.deactivateUser);
            app.put(`${baseUrl}/:userId/force-logout`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.forceLogout);
            app.put(`${baseUrl}/password-reset`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.setPassword, mailer.passwordReset)
            app.put(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users,user.updateUser);
            app.post(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.createUser, mailer.newAccount, (req, res) => {
                res.sendStatus(201)
            }); 
        },
        company:(app) => {
            const baseUrl = '/company';
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getList)
            app.get(`${baseUrl}/:companyId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.details)
            app.delete(`${baseUrl}/:companyId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.delete)
            app.get(`${baseUrl}/timezones/all`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getTimezoneList)
            app.put(`${baseUrl}/timezone`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setTimezone)
            app.put(`${baseUrl}/dst`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setDst)
            app.put(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.edit)
            app.post(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.create)
        },
        category:(app) => {
            const baseUrl = '/category';
            app.get(baseUrl + '/criteria-options',auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.criteriaOptions)
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.getList);
            app.get(baseUrl + '/summary', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.getSummary);
            app.put(`${baseUrl}/expiration`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateExpiration);
            app.put(`${baseUrl}/criteria`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateCriteria);
            app.put(`${baseUrl}/criteria`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateCriteria);
            app.put(`${baseUrl}`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.editCategory);
            app.post(`${baseUrl}`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.addCategory);
            app.delete(`${baseUrl}/:categoryId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.delete);
        }
    }
}