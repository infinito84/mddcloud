var mongoose = require('mongoose');

module.exports=(function(){
	mongoose.connect('mongodb://localhost/mddcloud');
	
	//require("./testData") //For Development
	
	return mongoose.connection;
})();