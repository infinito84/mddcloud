var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var participantSchema=Schema({
		creationDate 	: {type : Date, default : Date.now},
		status			: {type : String, enum : ['ENABLED','DISABLED'], default : 'ENABLED'},
		role			: {type : String, enum : ['EDITOR','READER','SUPERVISOR','ADMIN']},
		user			: {type : Schema.ObjectId, ref : "User"}
	});

	return mongoose.model('Participant',participantSchema);
})();