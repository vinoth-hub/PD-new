const helpers = require('../shared/helpers');
const config = require('../shared/config');
const smtpConfig = config.smtp;
module.exports = {
    newAccount: async(req, res,next) => {
        try{
            req.mail = {
                to: req.body.email,
                subject: 'New Account Created',
                salutation: req.body.username,
                content: `New account has been created for you on PD. Please use the following password to login. It is recommended to change it after logging in. </p><p> ${req.newPassword.password} </p><p> Thanks,</br> WRP Archive`
            }
            await helpers.sendMailAsync({
                config: smtpConfig,
                mail: req.mail
            })
            if(next)
                next();
        }
        catch(err){
            res.sendStatus(200);
        }
    },
    passwordReset: async(req, res) => {
        try{
            req.mail = {
                to: req.body.email,
                subject: 'Password Reset Initiated',
                salutation: req.body.username,
                content: `New Password has been generated for your account on PD. Please use the following password to login. It is recommended to change it after logging in. </p><p> ${req.newPassword.password} </p><p> Thanks,</br> WRP Archive`
            }
            await helpers.sendMailAsync({
                config: smtpConfig,
                mail: req.mail
            })
            res.sendStatus(200);
        }
        catch(err){
            res.sendStatus(200);
        }
    },
}