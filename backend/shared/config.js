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
        host: 'imanage.host',
        user: 'pdis',
        password: 'PDIS123!',
        connectionLimit: 5,
        port: 3306,
        allowPublicKeyRetrieval: true
    },
    jwtEncodingSecret: 'apfsds',
    isProd: false, // For debugging! Make true in prod for security!
    autoLogOutAfterMins: 20
}