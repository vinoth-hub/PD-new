let mysql = require('mysql2/promise');
const config = require('../shared/config');
const helpers = require('../shared/helpers');
const pool = mysql.createPool(config.db);

module.exports = {
    userList: async (req, res) => { // Lazy load by page number

        let conn;
        try {
            conn = await pool.getConnection();
            var response = {};
            var filterClause = '';
            if (req.query.search?.length)
                filterClause = `and (u.username like '%${req.query.search}%' or u.fullname like '%${req.query.search}%' or u.title like '%${req.query.search}%')`;
            var subQuery = `(select u.username, u.userID, c.category, s.level, u.ip, u.title, u.fullname, u.defaultcompany
            from ${req.decodedJwt.db}.user u left join ${req.decodedJwt.db}.transsecurity t on u.userID = t.userID
            inner join ${req.decodedJwt.db}.company c2 on c2.companyID = t.companyID 
            left join ${req.decodedJwt.db}.security s on t.securityID = s.securityID and t.companyID = s.companyID 
            left join ${req.decodedJwt.db}.category c on t.categoryID = c.categoryID and t.companyID = c.companyID 
            where c2.companyID = ${req.query.selectedCompany} and u.isDeleted = 0 ${filterClause})`; // TO-DO: Check for SQLi
            var query = `select sq.username, sq.userID, sq.fullname as fullName, group_concat(sq.category) as categoryList, group_concat(sq.level)as levelList, sq.ip, sq.title, sq.defaultcompany as defaultCompany from `
                + subQuery +
                `as sq group by sq.userID order by sq.userID limit ${25 * (req.query.pageNumber - 1)},25`
            let [rows, fields] = await conn.query(query);
            rows.forEach((user) => {
                user.categoryList = user.categoryList?.length ? user.categoryList.split(',') : user.categoryList
                user.levelList = user.levelList?.length ? user.levelList.split(',') : user.levelList
                if (user.categoryList?.length > 3)
                    user.categoryListSummary = user.categoryList.slice(0, 3)
                if (user.levelList?.length > 3)
                    user.levelListSummary = user.levelList.slice(0, 3)
            })
            response.userList = rows;
            response.count = (await conn.query(`select count(1) as rowCount from  ${req.decodedJwt.db}.\`user\` u where 
                exists (select * from ${req.decodedJwt.db}.transsecurity t where t.userID = u.userID and t.companyID = ${req.query.selectedCompany})
                and u.isDeleted = 0 ${filterClause}`))[0].rowCount
            res.send(response);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },
    getSummary: async (req, res) => { // Lazy load for above, not this because this has data from only one table
        let conn;
        try {
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`SELECT userID, username, fullname as fullName FROM ${req.decodedJwt.db}.\`user\` ORDER BY username`)
            res.send(rows);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },
    getTsDetails: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            var subQuery = `(select u.userID, c.category, s.level
                from ${req.decodedJwt.db}.user u left join ${req.decodedJwt.db}.transsecurity t on u.userID = t.userID
                inner join ${req.decodedJwt.db}.company c2 on c2.companyID = t.companyID 
                left join ${req.decodedJwt.db}.security s on t.securityID = s.securityID and t.companyID = s.companyID 
                left join ${req.decodedJwt.db}.category c on t.categoryID = c.categoryID and t.companyID = c.companyID 
                where c2.companyID = ${req.query.selectedCompany} and u.isDeleted = 0 and u.userID = ${req.params.userId})`;
            var query = `select sq.userID, group_concat(sq.category) as categoryList, group_concat(sq.level) as levelList from ` + subQuery +
                `as sq group by sq.userID`;
            var [rows, fields] = await conn.query(query);
            res.send(rows[0]);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },
    deleteUser: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.\`user\` set isDeleted = 1 where userID = ?`, [req.params.userId])
            res.sendStatus(204);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },
    deactivateUser: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query(`update ${req.decodedJwt.db}.\`user\` set isActive = 0 where userID = ?`, [req.params.userId])
            res.sendStatus(204);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },
    setPassword: async (req, res, next) => {
        var conn;
        try {
            conn = await pool.getConnection();
            await conn.query(`UPDATE ${req.decodedJwt.db}.\`user\` SET password=? WHERE userID=?`, [req.newPassword.hash, req.body.userId]);
            next();
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },
    getAllAccessPages: async (req, res) => {
        var conn;
        try {
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`select distinct s.\`level\` from ${req.decodedJwt.db}.\`security\` s`);
            res.send(rows.map(x => x.level));
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },
    getAllCategories: async (req, res) => {
        var conn;
        try {
            conn = await pool.getConnection();
            var [rows, fields] = await conn.query(`select distinct c.category from ${req.decodedJwt.db}.category c where companyID = ${req.query.selectedCompany} `);
            res.send(rows.map(x => x.category));
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },
    updateUser: async (req, res) => {
        var conn;
        try {
            conn = await pool.getConnection();
            var [currentTsList, fields] = await conn.query(`select t.transsecurityID, s.\`level\`, c.category, t.userID from ${req.decodedJwt.db}.transsecurity t
                left join ${req.decodedJwt.db}.\`security\` s on t.securityID = s.securityID and t.companyID = s.companyID
                left join ${req.decodedJwt.db}.category c on t.categoryID  = c.categoryID and t.companyID = c.companyID 
                where t.userID = ${req.body.userID} and t.companyID = ${req.query.selectedCompany}`);
            var accessesToAdd = [];
            var accessesToRemove = [];
            currentTsList.forEach((x) => {
                if (x.level && !req.body.levelList.includes(x.level))
                    accessesToRemove.push(x.level);
            })
            req.body.levelList.forEach((x) => {
                if (!currentTsList.filter(y => y.level === x).length)
                    accessesToAdd.push(x)
            })
            var categoriesToAdd = [];
            var categoriesToRemove = [];
            currentTsList.forEach((x) => {
                if (x.category && !req.body.categoryList.includes(x.category))
                    categoriesToRemove.push(x.category);
            })
            req.body.categoryList.forEach((x) => {
                if (!currentTsList.filter(y => y.category === x).length)
                    categoriesToAdd.push(x)
            })
            var tsInsertQuery = `INSERT INTO ${req.decodedJwt.db}.transsecurity
                (userID, companyID, categoryID, securityID)
                values `;
            accessesToAdd.forEach((x) => {
                tsInsertQuery += `(${req.body.userID}, ${req.query.selectedCompany}, NULL, 
                    (SELECT s.securityID FROM ${req.decodedJwt.db}.security s WHERE s.level='${x}' AND s.companyID = ${req.query.selectedCompany})),`
            })
            categoriesToAdd.forEach((x) => {
                tsInsertQuery += `(${req.body.userID},
                    ${req.query.selectedCompany},
                    (SELECT c.categoryID FROM ${req.decodedJwt.db}.category c WHERE c.category='${x}' AND c.isdeleted=0 AND c.companyID = ${req.query.selectedCompany}),
                    NULL),`
            })
            tsInsertQuery = tsInsertQuery.substring(0, tsInsertQuery.length - 1)
            accessesToRemove.forEach(async (x) => {
                var [security, fields] = await conn.query(`SELECT securityID FROM ${req.decodedJwt.db}.security s WHERE s.level = '${x}' AND s.companyID = ${req.query.selectedCompany}`);
                var securityID = security.securityID;
                await conn.query(`delete from ${req.decodedJwt.db}.transsecurity where userID = ${req.body.userID} and companyID = ${req.query.selectedCompany} and securityID  = ${securityID}`);
            })
            categoriesToRemove.forEach(async (x) => {
                var [category, fields] = await conn.query(`SELECT categoryID FROM ${req.decodedJwt.db}.category c WHERE c.category = '${x}' AND c.companyID = ${req.query.selectedCompany}`);
                var categoryID = category[0].categoryID;
                await conn.query(`delete from ${req.decodedJwt.db}.transsecurity where userID = ${req.body.userID} and companyID = ${req.query.selectedCompany} and categoryID  = ${categoryID}`);
            })
            var userUpdateQuery = `UPDATE ${req.decodedJwt.db}.user SET 
                username = '${req.body.username}',
                fullname = '${req.body.fullName}',
                title = '${req.body.title}',
                ip = '${req.body.ip}'
                WHERE userID = ${req.body.userID}`;
            await conn.beginTransaction();
            if (accessesToAdd.length || categoriesToAdd.length)
                await conn.query(tsInsertQuery);
            await conn.query(userUpdateQuery);
            await conn.commit();
            res.sendStatus(204);
        }
        catch (err) {
            await conn.rollback();
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },
    createUser: async (req, res, next) => {
        var conn;
        try {
            conn = await pool.getConnection();
            var [duplicateUsers, fields] = await conn.query(`SELECT count(1) FROM ${req.decodedJwt.db}.user WHERE title = '${req.body.title}'`)
            if (duplicateUsers && duplicateUsers?.[0] && duplicateUsers?.[0]?.['count(1)']) {
                res.status(400);
                res.send('Duplicate user exists with same email');
                return;
            }
            console.log("before insert...........");

            var insertResult = await conn.query(`
            INSERT INTO ${req.decodedJwt.db}.\`user\`
            (isActive,
            isDeleted,
            username,
            password,
            ip,
            title,
            issysadm,
            defaultcompany,
            passwordexpires,
            fullname)
            VALUES
            (1,
             0,
             '${req.body.username}',
             '${req.newPassword.hash}',
             '${req.body.ip}',
             '${req.body.title}',
             ${req.body.issysadm},
              '${req.body.defaultcompany || req.query.selectedCompany}',
             '${helpers.prepareDateForMaria(new Date)}',
             '${req.body?.fullName}');`);

            var insertId = insertResult[0].insertId

            for (var companies of req.body.accessList) {

                for (var access of companies.levelList) {
                    var [security, fields] = await conn.query(`SELECT securityID FROM ${req.decodedJwt.db}.security WHERE companyID = ${req.query.selectedCompany} AND level = '${access}'`);
                    var securityID = security?.[0]?.securityID || null
                    await conn.query(`INSERT INTO ${req.decodedJwt.db}.transsecurity
                (userID, companyID, categoryID, securityID)
                VALUES(${insertId}, ${companies.companyID}, NULL, ${securityID});
                `);
                }
                for (var category of companies.categoryList) {
                    var [category, fields] = await conn.query(`SELECT categoryID FROM ${req.decodedJwt.db}.category WHERE companyID = ${req.query.selectedCompany} AND category = '${category}' AND isdeleted = 0 `);
                    var categoryID = category?.[0]?.categoryID || null;
                    await conn.query(`INSERT INTO ${req.decodedJwt.db}.transsecurity
                (userID, companyID, categoryID, securityID)
                VALUES(${insertId}, ${companies.companyID}, ${categoryID}, NULL);
                `);
                }
            }

            next()
        }
        catch (err) {
            console.log('err: ', err);
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },
    forceLogout: async (req, res, next) => {
        var conn;
        try {
            conn = await pool.getConnection();
            var lastActivity = new Date(0);
            await conn.query(`UPDATE ${req.decodedJwt.db}.\`user\` SET lastactivity=? WHERE userID=?`, [helpers.prepareDateForMaria(lastActivity), req.params.userId]);
            next()
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn) conn.release();
        }
    },


    alluserList: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            var response = {};
            var filterClause = '';
            if (req.query.search?.length)
                filterClause = `and (u.username like '%${req.query.search}%' or u.fullname like '%${req.query.search}%' or u.title like '%${req.query.search}%')`;
            var subQuery = `(select u.username, u.userID, c.category, s.level, u.ip, u.title, u.fullname, u.defaultcompany
            from ${req.decodedJwt.db}.user u left join ${req.decodedJwt.db}.transsecurity t on u.userID = t.userID
            inner join ${req.decodedJwt.db}.company c2 on c2.companyID = t.companyID 
            left join ${req.decodedJwt.db}.security s on t.securityID = s.securityID and t.companyID = s.companyID 
            left join ${req.decodedJwt.db}.category c on t.categoryID = c.categoryID and t.companyID = c.companyID 
            where u.isDeleted = 0 ${filterClause})`; // TO-DO: Check for SQLi
            var query = `select sq.username, sq.userID, sq.fullname as fullName, group_concat(sq.category) as categoryList, group_concat(sq.level)as levelList, sq.ip, sq.title, sq.defaultcompany as defaultCompany from `
                + subQuery +
                `as sq group by sq.userID order by sq.userID limit ${25 * (req.query.pageNumber - 1)},25`
            let [rows, fields] = await conn.query(query);
            rows.forEach((user) => {
                user.categoryList = user.categoryList?.length ? user.categoryList.split(',') : user.categoryList
                user.levelList = user.levelList?.length ? user.levelList.split(',') : user.levelList
                if (user.categoryList?.length > 3)
                    user.categoryListSummary = user.categoryList.slice(0, 3)
                if (user.levelList?.length > 3)
                    user.levelListSummary = user.levelList.slice(0, 3)
            })
            response.userList = rows;
            response.count = (await conn.query(`select count(1) as rowCount from  ${req.decodedJwt.db}.\`user\` u where 
                exists (select * from ${req.decodedJwt.db}.transsecurity t where t.userID = u.userID )
                and u.isDeleted = 0 ${filterClause}`))[0].rowCount
            res.send(response);
        }
        catch (err) {
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },


    getUserDetailsById: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            var [userData, fields] = await conn.query(`
            SELECT
                u.userID,
                u.username,
                u.password,
                u.title,
                u.ip,
                u.isActive,
                u.issysadm,
                u.defaultcompany,
                t.companyID,
                c.category AS categoryName,
                s.level AS securityName
            FROM
                ${req.decodedJwt.db}.user u
            LEFT JOIN
                ${req.decodedJwt.db}.transsecurity t ON u.userID = t.userID
            LEFT JOIN
             ${req.decodedJwt.db}.category c ON t.categoryID = c.categoryID
            LEFT JOIN
             ${req.decodedJwt.db}.security s ON t.securityID = s.securityID
            WHERE
                u.userID = ${req.params.userId};
        `);


            var userOutput = {
                userID: userData[0].userID,
                username: userData[0].username,
                password: userData[0].password,
                title: userData[0].title,
                ip: userData[0].ip,
                isActive: userData[0].isActive,
                issysadm: userData[0].issysadm,
                defaultcompany: userData[0].defaultcompany,
                accessList: []
            };

            userData.forEach((row) => {
                // Find the company in accessList or create a new entry
                var companyEntry = userOutput.accessList.find((entry) => entry.companyID === row.companyID);

                if (!companyEntry) {
                    companyEntry = {
                        companyID: row.companyID,
                        categoryList: [],
                        levelList: []
                    };
                    userOutput.accessList.push(companyEntry);
                }

                // Add category and level to the respective lists
                if (row.categoryName) {
                    companyEntry.categoryList.push(row.categoryName);
                }

                if (row.securityName) {
                    companyEntry.levelList.push(row.securityName);
                }
            });

            res.send(userOutput);
        }
        catch (err) {
            console.log('err: ', err);
            helpers.handleError(res, err);
        }
        finally {
            if (conn)
                conn.release();
        }
    },


    updateUserById: async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const { userID, username, password, accessList, ip, title, issysadm, defaultcompany } = req.body;
            console.log('req.body: ', req.body);

            await conn.query(`
                UPDATE ${req.decodedJwt.db}.user
                SET username = '${username}', password = '${password}', ip = '${ip}',  title = '${title}',  issysadm = '${issysadm}', defaultcompany = '${defaultcompany}'
                WHERE userID = ${userID};
            `);

            const [existingAccess, _] = await conn.query(`
                SELECT companyID, categoryID, securityID
                FROM ${req.decodedJwt.db}.transsecurity
                WHERE userID = ${userID};
            `);

            const existingAccessMap = new Map(existingAccess.map(row => [`${row.companyID}-${row.categoryID || ''}-${row.securityID || ''}`, row]));
            console.log('existingAccessMap: ', existingAccessMap);

            for (const { companyID, categoryList, levelList } of accessList) {

                for (const category of categoryList) {
                    const categoryKey = `${companyID}-${category}-`;

                    if (!existingAccessMap.has(categoryKey)) {
                        const [categoryResult, _] = await conn.query(`
                            INSERT INTO ${req.decodedJwt.db}.transsecurity (userID, companyID, categoryID,securityID)
                            VALUES (${userID}, ${companyID}, (SELECT categoryID FROM ${req.decodedJwt.db}.category WHERE category = '${category}' LIMIT 1) , NULL );
                        `);
                    } else {
                        // Remove category from existingAccessMap to track the ones to be deleted
                        existingAccessMap.delete(categoryKey);
                    }
                }

                for (const level of levelList) {
                    const levelKey = `${companyID}--${level}`;
                    if (!existingAccessMap.has(levelKey)) {
                        // Insert new level
                        const [levelResult, _] = await conn.query(`
                            INSERT INTO ${req.decodedJwt.db}.transsecurity (userID, companyID,categoryID, securityID)
                            VALUES (${userID}, ${companyID},NULL, (SELECT securityID FROM ${req.decodedJwt.db}.security WHERE level = '${level}' LIMIT 1));
                        `);
                    } else {
                        // Remove level from existingAccessMap to track the ones to be deleted
                        existingAccessMap.delete(levelKey);
                    }
                }
            }

            // Delete the remaining categories and levels in existingAccessMap
            for (const [key, row] of existingAccessMap) {
                await conn.query(`
                    DELETE FROM ${req.decodedJwt.db}.transsecurity
                    WHERE userID = ${userID} AND companyID = ${row.companyID} AND categoryID = ${row.categoryID};
                `);
            }

            for (const [key, row] of existingAccessMap) {
                await conn.query(`
                    DELETE FROM ${req.decodedJwt.db}.transsecurity
                    WHERE userID = ${userID} AND companyID = ${row.companyID} AND securityID = ${row.securityID};
                `);
            }


            // Commit the transaction
            await conn.commit();

            res.status(200).send("User information updated successfully");
        } catch (error) {
            console.log('error: ', error);
            // Rollback the transaction in case of an error
            await conn.rollback();
            console.error("Error updating user:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            // Release the connection
            conn.release();
        }
    },

}