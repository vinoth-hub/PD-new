var express = require('express');
var cors = require('cors');
var auth = require('./service/auth')
var user = require('./service/user')
var common = require('./service/common')
var app = express();
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));

app.post('/login', auth.login)
app.get('/companies', auth.decodeJwt, (req, res, next) => {
    if(!req.decodedJwt){
        res.sendStatus(403);
        return;
    }
    next();
}, common.getCompanyList)

app.get('/users', auth.decodeJwt, auth.authorize.users,user.userList);

app.listen(port, ()=>{
    console.log('Ready on ',port)
})