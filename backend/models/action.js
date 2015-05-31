var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var activitySchema=Schema({
		operation			: {type : String, enum : ['CREATE','READ','UPDATE','DELETE']},
		storageRequirement 	: {type : Schema.ObjectId, ref : 'StorageRequirement'},
		readMethod			: {	
								type : String, 
								enum : ['GENERAL','SPECIFIC','SESSION','NO APPLY'], 
								default: 'NO APPLY'
							  },
		x 					: Number,
		y 					: Number,
		width 				: Number,
		height 				: Number,
		parentAction 		: {type : Schema.ObjectId, ref : 'Action'},
	});

	return mongoose.model('Action',activitySchema);
})();