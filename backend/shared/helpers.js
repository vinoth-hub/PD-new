const nodemailer = require('nodemailer');
module.exports = {
    prepareDateForMaria: (date) => date.toISOString().replace('T', ' ').replace('Z', ''),
    sendMailAsync: (mailData) => {
        return new Promise((resolve, reject) => {
            if(!mailData.mail.to.includes('adriyaman'))
                throw new Error('Not now!!')
            var transporter = nodemailer.createTransport(mailData.config);
            var mailOptions = {
                from: mailData.config.auth.user,
                to: mailData.mail.to, 
                subject: mailData.mail.subject,
                html: 
                `<!DOCTYPE html>
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
                </html>`
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if(err){
                    reject(err);
                    console.error(err);
                }
                else{
                    resolve(info);
                    console.info(info);
                }
            })
        })
    }
}