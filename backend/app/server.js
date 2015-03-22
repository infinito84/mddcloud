var express 	= require('express'),
	http 		= require('http'),
	session 	= require('express-session'),
	bodyParser 	= require('body-parser'),
	multer 		= require('multer'),
	store 		= new session.MemoryStore(),
	growl 		= require('growl'),
	config 		= require('./config'),
	nodemailer	= require('nodemailer'),
	hbs 		= require('nodemailer-express-handlebars'),
	exphbs 		= require('express-handlebars'),
	i18next		= require('i18next');

module.exports=(function(){
	//Express Instance
	var app = express();
	app.config = config;

	//For req.body.key = value
	app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({ extended: true })); 
	app.use(multer()); 

	//For to serve the frontend app
	app.use(express.static("frontend/public"));

	//Defining the views and Handlebars engine for backend
	var handlebars = exphbs.create({
		extname : '.hbs',
		helpers : {
			//Traslate helper
			t : function(i18n_key){
				var result = i18next.t(i18n_key);
				if(result===''||result===null||result===undefined)return i18n_key;
				return result;
			}
		}
	});
	app.engine('.hbs', handlebars.engine);
	app.set('view engine', '.hbs');
	app.set('views',config.folder + 'views');

	//Custom session for Socket.IO support
	app.use(session({
		store 				: store,
		secret				: 'mddcloud',
		resave				: false,
		saveUninitialized 	: true
	}));

	//Configuring E-mail sender
	app.nodemailer = nodemailer.createTransport(config.nodemailer);
	app.nodemailer.use('compile', hbs({
		viewEngine 	: handlebars,
		viewPath	: config.folder + 'views',
		extName 	: '.hbs'
	}));

	//Configuring Backend Translator
	i18next.init({
		debug 		: true,
		fallbackLng	:'en',
		setJqueryExt: false,
		preload 	: ['en','es','fr','pt'],
		resGetPath	: config.folder + 'locales/__lng__/__ns__.json'
	});
	app.use(i18next.handle);
	i18next.registerAppHelper(app);
	app.i18next = i18next;

	//Creating the server at 8084 port :)
	var server=http.Server(app).listen(8084);
	growl("MDDCloud server is listening on 8084 port");	

	//Binding the Socket.IO layer to the server
	require("./socket")(server,store);	
	return app;
})();
