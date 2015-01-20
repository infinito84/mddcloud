var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var objectiveSchema=Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}],
		parentObjective : {type : Schema.ObjectId, ref : 'Objective', default : null}
	});

	return mongoose.model('Objective',objectiveSchema);
})();