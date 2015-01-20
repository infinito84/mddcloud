var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var diagramActivitySchema=Schema({
		type 		: {type : String, enum : ['GENERAL','SPECIFIC']},
		activities	: [{
			type : Schema.ObjectId,
			ref  : 'Activity'
		}]
	});

	return mongoose.model('DiagramActivity',diagramActivitySchema);
})();