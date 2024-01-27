const auth = require('../service/auth');
const user = require('../service/user');
const shared = require('../service/shared');
const mailer = require('../service/mailer');
const helpers = require('../shared/helpers');
const company = require('../service/company');
const category = require('../service/category');
const quickSearch = require('../service/quick-search');
const powerSearch = require('../service/power-search');

module.exports = {
    register: {
        shared: (app) => {
            const baseUrl = '/api/';
            app.post(`${baseUrl}login`, auth.login, auth.decodeJwt, helpers.updateLastActivity, (req, res) => {
                res.send(req.loginResult)
            })
            app.get(`${baseUrl}companies`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.common, shared.getCompanyList)
            app.get(`${baseUrl}search/:searchType/access`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.generic, (req, res) => {
                res.sendStatus(204)
            });
            app.get(`${baseUrl}search/:searchType/download`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.specific, shared.download);
            app.put(`${baseUrl}search/:searchType/note`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.specific, shared.updateNote)
        },
        user: (app, wsServer) => {
            const baseUrl = '/api/user';
            app.get(`${baseUrl}/all-access-pages`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllAccessPages);
            app.get(`${baseUrl}/all-categories`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getAllCategories);
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.userList);
            app.get(`${baseUrl}/all-users`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, user.alluserList);
            app.get(`${baseUrl}/summary`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getSummary);
            app.get(`${baseUrl}/:userId/ts-details`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getTsDetails);
            app.delete(`${baseUrl}/:userId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.deleteUser);
            app.put(`${baseUrl}/:userId/deactivate`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.deactivateUser);
            app.put(`${baseUrl}/:userId/force-logout`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.forceLogout, shared.broadcastLogout(wsServer));
            app.put(`${baseUrl}/password-reset`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.setPassword, mailer.passwordReset)
            app.put(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.updateUser);
            app.post(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, auth.generatePassword, user.createUser,
                //  mailer.newAccount, 
                (req, res) => {
                    res.sendStatus(201)
                }
            );

            app.get(`${baseUrl}/:userId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.getUserDetailsById);
            app.put(`${baseUrl}-Id`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.users, user.updateUserById);

        },
        company: (app) => {
            const baseUrl = '/api/company';
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getList)
            app.get(`${baseUrl}/:companyId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.details)
            app.delete(`${baseUrl}/:companyId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.delete)
            app.get(`${baseUrl}/timezones/all`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getTimezoneList)
            app.put(`${baseUrl}/timezone`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setTimezone)
            app.put(`${baseUrl}/dst`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.setDst)
            app.put(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.edit)
            app.post(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.create)
            app.get(`${baseUrl}/category/all`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.companies, company.getCompanyWithCategory)
        },
        category: (app) => {
            const baseUrl = '/api/category';
            app.get(baseUrl + '/criteria-options', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.criteriaOptions)
            app.get(baseUrl, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.getList);
            app.get(baseUrl + '/summary', auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.getSummary);
            app.put(`${baseUrl}/expiration`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateExpiration);
            app.put(`${baseUrl}/criteria`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateCriteria);
            app.put(`${baseUrl}/criteria`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.updateCriteria);
            app.put(`${baseUrl}`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.editCategory);
            app.post(`${baseUrl}`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.addCategory);
            app.delete(`${baseUrl}/:categoryId`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.authorize.category, category.delete);
        },
        search: (app) => {
            const baseUrl = '/api/search/quick'
            app.get(`${baseUrl}/submit`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.generic, quickSearch.quickSearch);
        },
        powerSearch: (app) => {
            const baseUrl = '/api/search/power'
            app.get(`${baseUrl}/category-options`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.generic, powerSearch.getUniqueCategories)
            app.post(`${baseUrl}/submit`, auth.decodeJwt, auth.checkLastActivity, helpers.updateLastActivity, auth.preAuthorize.search, auth.authorize.search.generic, powerSearch.doSearch)
        }
    }
}