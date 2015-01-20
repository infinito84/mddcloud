var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var projectSchema=new Schema({
		name 			: {type : String, trim : true},
		description		: String,
		creationDate 	: {type : Date, default : Date.now},
		template		: {type : String, uppercase : true, default : 'UNITED'},

		participants : [{
			type : Schema.ObjectId,
			ref  : "Participant"
		}],

		multimedias	: [{
			type : Schema.ObjectId,
			ref  : "Multimedia"
		}],

		objectives : [{
			type : Schema.ObjectId,
			ref  : "Objective"
		}],

		storageRequirements	: [{
			type : Schema.ObjectId,
			ref  : "StorageRequirement"
		}],

		functionalRequirements : [{
			type : Schema.ObjectId,
			ref  : "FunctionalRequirement"
		}],

		nonFunctionalRequirements : [{
			type : Schema.ObjectId,
			ref  : 'NonFunctionalRequirement'
		}],

		actors : [{
			type : Schema.ObjectId,
			ref  : 'Actor'
		}],

		classAssociations : [{
			type : Schema.ObjectId,
			ref  : 'ClassAssociation'
		}],

		useCaseAssociations : [{
			type : Schema.ObjectId,
			ref  : 'UseCaseAssociation'
		}],

		enumerations : [{
			type : Schema.ObjectId,
			ref  : 'Enumeration'
		}]

	});

	//For Deep Population
	projectSchema.plugin(require('mongoose-deep-populate'));

	return mongoose.model('Project',projectSchema);
})();