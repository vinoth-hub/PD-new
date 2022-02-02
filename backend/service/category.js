const mariadb = require('mariadb');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mariadb.createPool(config.db);

module.exports = {
    getList: async (req, res) => {
        let conn;
        try{
            conn = await pool.getConnection();
            var response = {};
            var subQuery = `(select c.categoryID, c.category as name, c.companyID, c2.criteria, c.expiration from ${req.decodedJwt.db}.category c
            left join  ${req.decodedJwt.db}.criteria c2 on c.categoryID = c2.categoryID and c.companyID = c2.companyID where c.isdeleted = 0 and (c2.isdeleted is null or c2.isdeleted = 0))`; // TO-DO: Check for SQLi
            var query = `select sq.categoryid, sq.name, group_concat(sq.criteria) criteriaList, sq.expiration from `
            + subQuery + 
            `as sq where sq.companyID = ${req.query.selectedCompany} group by sq.categoryID order by sq.name limit ${3 * (req.query.pageNumber - 1)},3`
            let rows = await conn.query(query);
            rows.forEach((cat)=>{
                cat.criteriaList = cat.criteriaList?.length ? cat.criteriaList.split(',') : cat.criteriaList
                if(cat.criteriaList?.length > 3)
                    cat.criteriaListSummary = cat.criteriaList.slice(0, 3);
            })
            response.list = rows;
            response.count = (await conn.query(`select count(1) as rowCount from  ${req.decodedJwt.db}.category 
            where isdeleted = 0 and companyID = ${req.query.selectedCompany}`))[0].rowCount
            res.send(response);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    getSummary: async (req, res) => {
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`SELECT categoryID, category as name FROM ${req.decodedJwt.db}.category WHERE isdeleted = 0 AND companyID = ${req.query.selectedCompany}`);
            res.send(rows);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    updateExpiration: async (req, res) => {
        try{
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.category set expiration=${req.body.expiration} where categoryID=${req.body.categoryID}
            and companyID=${req.query.selectedCompany} 
            `)// company id filter for security
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    delete: async (req, res) => {
        try{
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.category set isdeleted=1 where categoryID=${req.params.categoryId}
            and companyID=${req.query.selectedCompany} 
            `)// company id filter for security
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    criteriaOptions: async (req, res) => {
        try{
            conn = await pool.getConnection();
            var rows = await conn.query(`select distinct c.criteria from ${req.decodedJwt.db}.criteria c where c.isdeleted = 0 and companyID=${req.query.selectedCompany} `)
            res.send(rows.map(row => row.criteria));
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    updateCriteria: async (req, res) => {
        try{
            conn = await pool.getConnection();
            var currentCriteria = await conn.query(`select distinct c.criteria from ${req.decodedJwt.db}.criteria c where c.isdeleted = 0 and companyID=${req.query.selectedCompany} and categoryID = ${req.body.categoryID}`)
            currentCriteria = currentCriteria.map(x => x.criteria);
            var newCriteria = req.body.criteriaList;
            for(var item of currentCriteria){
                if(!newCriteria.includes(item)) // TO-DO: Check for soft deleted ones?
                    await conn.query(`update ${req.decodedJwt.db}.criteria set isdeleted = 1 where companyID=${req.query.selectedCompany} and categoryID = ${req.body.categoryID} and criteria='${item}'`)
            }
            for(var item of newCriteria){
                if(!currentCriteria.includes(item))
                    await conn.query(`INSERT INTO demo36.criteria
                    (companyID, categoryID, criteria, datatype, orderby, lookup, display, isdeleted)
                    VALUES(${req.query.selectedCompany}, ${req.body.categoryID}, '${item}', 'text', 1, 0, 1, 0);`)
            }
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    editCategory: async (req, res) => {
        try{
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.category SET category = '${req.body.name}', expiration = ${req.body.expiration} WHERE categoryID = ${req.body.categoryID} AND companyID = ${req.query.selectedCompany}`)
            res.sendStatus(204);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    },
    addCategory: async (req, res) => {
        try{
            conn = await pool.getConnection();
            var result = await conn.query(`INSERT INTO ${req.decodedJwt.db}.category
            (companyID, category, isdeleted, expiration)
            VALUES(${req.query.selectedCompany}, '${req.body.name}', 0, ${req.body.expiration});
            `)
            if(req.body.sourceCategoryID > 0){
                await conn.query(`
                INSERT INTO ${req.decodedJwt.db}.criteria(
                    companyID,
                    categoryID,
                    criteria,
                    datatype,
                    orderby,
                    lookup,
                    display,
                    isdeleted)
                SELECT
                    ${req.query.selectedCompany},
                    ${result.insertId},
                    criteria,
                    datatype,
                    orderby,
                    lookup,
                    display,
                    isdeleted
                FROM 
                    ${req.decodedJwt.db}.criteria 
                WHERE 
                    companyID = ${req.query.selectedCompany} AND
                    categoryID = ${req.body.sourceCategoryID};
                `)
            }
            res.sendStatus(201);
        }
        catch(err){
            helpers.handleError(res, err);
        }
        finally{
            if(conn)
                conn.end();
        }
    }
}