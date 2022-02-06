var express = require('express');
var cors = require('cors');
var https = require('https');
var Websocket = require('ws');
var fs = require('fs');
const routes = require('./shared/routes');
var app = express();
var path = require('path');
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));


const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
var httpServer = https.createServer(httpsOptions, app)
var wsServer = new Websocket.WebSocketServer({server: httpServer});
routes.register.common(app);
routes.register.user(app, wsServer);
routes.register.company(app);
routes.register.category(app);

httpServer.listen(port, ()=>{
    console.log('Ready on ',port)
})