var express = require('express');
var cors = require('cors');
const routes = require('./shared/routes');
var app = express();
var path = require('path');
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));

routes.register.common(app);
routes.register.user(app);
routes.register.company(app);
routes.register.category(app);

app.listen(port, ()=>{
    console.log('Ready on ',port)
})