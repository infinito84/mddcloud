var mongoose 	= require('mongoose'),
	config 		= require('../app/config');
	
module.exports=(function(){
	mongoose.connect(config.mongodb, { server: { poolSize: 100 }});
	
	//require("./testData") //For Development
	
	return mongoose.connection;
})();