var express = require('express'),
	http 	= require('http');

module.exports=(function(){
	var app = express();
	app.use(express.static("frontend/public"));
	app.set('views',__dirname+'/../views');
	app.set('view engine', 'hbs');
	var server=http.Server(app).listen(8084);
	require("./socket.js")(server);
	console.log("Server Listen on 8084 port");	
	return app;
})();
