let mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const config = require("../shared/config");
const pool = mysql.createPool(config.db);

let helpers = {
  prepareDateForMaria: (date) =>
    date.toISOString().replace("T", " ").replace("Z", ""),
  sendMailAsync: (mailData) => {
    return new Promise((resolve, reject) => {
      /*if(!mailData.mail.to.includes('adriyaman'))
                throw new Error('Not now!!')*/
      var transporter = nodemailer.createTransport(mailData.config);
      var mailOptions = {
        from: mailData.config.auth.user,
        to: mailData.mail.to,
        subject: mailData.mail.subject,
        html: `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>web mail</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body>  
                        <div>
			                <h3>&nbsp;</h3>
                            <p>Dear ${mailData.mail.salutation},</p>
                            <p> ${mailData.mail.content} </p>
                        </div>
                    </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
          console.error(err);
        } else {
          resolve(info);
          console.info(info);
        }
      });
    });
  },
  handleError: (res, err) => {
    if (config.isProd) res.sendStatus(500);
    else {
      res.status(500);
      res.send(err);
    }
  },
  updateLastActivity: async (req, res, next) => {
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query(
        `UPDATE ${req.decodedJwt.db
        }.user SET lastactivity = '${helpers.prepareDateForMaria(
          new Date()
        )}' WHERE userID = ${req.decodedJwt.userId}`
      ); //high overhead, so non blocking call
      next();
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
  checkAuthorization: async (req, res, next, fn, customCompanyFilter) => {
    let conn;
    try {
      var companyFilterClause = ` and t.companyID = ${req.query.selectedCompany}`; // default
      if (customCompanyFilter) {
        // custom
        if (!customCompanyFilter.length)
          // ignore
          companyFilterClause = "";
        // use list
        else
          companyFilterClause = `and t.companyID in [${customCompanyFilter.toLocaleString()}]`;
      }
      conn = await pool.getConnection();
      var query = `select count(1) from ${req.decodedJwt.db}.transsecurity t 
            inner join ${req.decodedJwt.db}.\`security\` s on t.securityID = s.securityID and t.companyID = s.companyID 
             where t.userID  = ${req.decodedJwt.userId} and \`level\` = '${fn}' ${companyFilterClause}`;
      var [rows, fields] = await conn.query(query);
      if (!rows || !rows[0] || !rows[0]["count(1)"]) {
        res.sendStatus(403);
        return;
      }
      next();
    } catch (err) {
      helpers.handleError(res, err);
    } finally {
      if (conn) conn.release();
    }
  },
};
module.exports = helpers;
