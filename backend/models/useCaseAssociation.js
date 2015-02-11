var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var useCaseAssociationSchema=Schema({
		type 			: {type : String, enum : ['CAN','EXTENDS']}, //CAN     : for actor-use_case
																	 //EXTENDS : for use_case - use_case
		useCase 		: {type : Schema.ObjectId, ref : 'FunctionalRequirement'},
		extendedUseCase : {type : Schema.ObjectId, ref : 'FunctionalRequirement',default : null },
		actor 			: {type : Schema.ObjectId, ref : 'Actor'}
	});

	return mongoose.model('UseCaseAssociation',useCaseAssociationSchema);
})();