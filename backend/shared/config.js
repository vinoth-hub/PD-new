/*
 * CAUTION: application secrets - highly confidential
 */

module.exports = {
    smtp: {
        host: 'smtp.hostinger.in',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'bmartyn@acmesoftware.net',
            pass: 'Reset123!'
        }
    },
    db: {
        host: 'localhost', 
        user:'root', 
        password: 'm249saw0',
        connectionLimit: 5,
        port:3306,
    },
    jwtEncodingSecret: 'apfsds'
}