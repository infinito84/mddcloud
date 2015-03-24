var mongoose 	= require('mongoose'),
	config 		= require('../app/config');
	
module.exports=(function(){
	mongoose.connect(config.mongodb);
	
	//require("./testData") //For Development
	
	return mongoose.connection;
})();