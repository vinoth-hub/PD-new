var express = require('express');
var cors = require('cors');
var http = require('http');
var Websocket = require('ws');
const routes = require('./backend/shared/routes');
var app = express();
var path = require('path');
var port = process.env.PORT || 42069;
app.use(express.json())
app.use(cors({
    origin: '*', 
}));


var httpServer = http.createServer(app)
var wsServer = new Websocket.WebSocketServer({server: httpServer});
routes.register.shared(app);
routes.register.user(app, wsServer);
routes.register.company(app);
routes.register.category(app);

app.use(express.static('dist/pd'));

app.get('/*',function(req,res){
	let reqPath = path.join(__dirname, 'dist/pd/index.html');
	res.sendFile(reqPath);
});



httpServer.listen(port, ()=>{
    console.log('Ready on ',port)
})