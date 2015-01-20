var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var participantSchema=Schema({
		creationDate 	: {type : Date, default : Date.now},
		state			: {type : String, enum : ['ENABLE','DISABLE'], default : 'ENABLE'},
		role			: {type : String, enum : ['EDITOR','READER','SUPERVISOR','ADMIN']},
		user			: {type : Schema.ObjectId, ref : "User"}
	});

	return mongoose.model('Participant',participantSchema);
})();