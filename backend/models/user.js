var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var userSchema=Schema({
		name 			: {type : String, trim : true},
		email 			: {type : String, trim : true},
		password 		: {type : String, trim : true, select : false, default : null},
		image 			: {type : String, trim : true, default : null},
		sessionDate 	: {type : Date, default : Date.now, select : false},
		sessionToken	: {type : String, select : false},
		isActive 		: {type : Boolean, default : false}
	});

	var User = mongoose.model('User',userSchema);


	return User;
})();