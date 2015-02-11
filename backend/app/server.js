var express = require('express'),
	http 	= require('http'),
	session = require('express-session'),
	store 	= new session.MemoryStore(),
	growl 	= require('growl');

module.exports=(function(){
	var app = express();
	app.use(express.static("frontend/public"));
	app.set('views',__dirname+'/../views');
	app.set('view engine', 'hbs');
	app.use(session({
		store 				: store,
		secret				: 'mddcloud',
		resave				: false,
		saveUninitialized 	: true
	}));
	var server=http.Server(app).listen(8084);
	require("./socket")(server,store);
	growl("MDDCloud server is listening on 8084 port");	
	return app;
})();
