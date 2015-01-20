var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var userSchema=Schema({
		name 			: {type : String, trim : true},
		email 			: {type : String, trim : true},
		password 		: {type : String, trim : true, select : false},
		image 			: {type : String, trim : true, default : null},
		sessionDate 	: {type : Date, default : null, select : false},
		sessionToken	: {type : Schema.ObjectId, default : null, select : false}
	});

	return mongoose.model('User',userSchema);
})();