var express = require('express');
var cors = require('cors');
var http = require('http');
var Websocket = require('ws');
const routes = require('./shared/routes');
var app = express();
var path = require('path');
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));


var httpServer = http.createServer(app)
var wsServer = new Websocket.WebSocketServer({server: httpServer});
routes.register.common(app);
routes.register.user(app, wsServer);
routes.register.company(app);
routes.register.category(app);

httpServer.listen(port, ()=>{
    console.log('Ready on ',port)
})