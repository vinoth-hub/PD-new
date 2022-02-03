var express = require('express');
var cors = require('cors');
const routes = require('./backend/shared/routes');
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


app.use(express.static('dist/pd'));

app.get('/*',function(req,res){
		let reqPath = path.join(__dirname, 'dist/pd/index.html');
		res.sendFile(reqPath);
	});



app.listen(port, ()=>{
    console.log('Ready on ',port)
})