var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var multimediaSchema=Schema({
		name 		: {type : String, trim : true},
		descripton 	: String,
		type 		: {type : String, enum : ['IMAGE','VIDEO','AUDIO','BINARY']},
		url 		: {type : String, trim : true}
	});

	return mongoose.model('Multimedia',multimediaSchema);
})();