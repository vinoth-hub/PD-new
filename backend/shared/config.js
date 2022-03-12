/*
 * CAUTION: application secrets - highly confidential
 */

module.exports = {
    smtp: {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'notifications@imanage.host',
            pass: 'Reset123!'
        }
    },
    db: {
        host: 'imanage.host',
        user: 'pdis',
        password: 'PDIS123!',
        connectionLimit: 5,
        port: 3306
    },
    jwtEncodingSecret: 'apfsds',
    isProd: false, // For debugging! Make true in prod for security!
    autoLogOutAfterMins: 20
}