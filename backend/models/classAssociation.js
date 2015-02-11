var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var classAssociationSchema=Schema({
		type 	: {type : String, enum : ['AGGREGATION']},
		classA 	: {type : Schema.ObjectId, ref : 'StorageRequirement'},
		classB 	: {type : Schema.ObjectId, ref : 'StorageRequirement'}
	});

	return mongoose.model('ClassAssociation',classAssociationSchema);
})();