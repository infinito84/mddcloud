var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var userSchema=Schema({
		name 			: {type : String, trim : true},
		email 			: {type : String, trim : true},
		password 		: {type : String, trim : true},
		image 			: {type : String, trim : true, default : null},
		sessionDate 	: {type : Date, default : null},
		sessionToken	: {type : Schema.ObjectId, default : null}
	});

	return mongoose.model('User',userSchema);
})();