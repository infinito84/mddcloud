var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var projectSchema=new Schema({
		name 			: {type : String, trim : true},
		description		: String,
		creationDate 	: {type : Date, default : Date.now},
		template		: {type : String, uppercase : true, default : 'UNITED'},

		participants : [{
			_id				: Schema.ObjectId,
			creationDate 	: {type : Date, default : Date.now},
			state			: {type : String, enum : ['ENABLE','DISABLE'], default : 'ENABLE'},
			role			: {type : String, enum : ['EDITOR','READER','SUPERVISOR','ADMIN']},
			userId			: Schema.ObjectId
		}],

		multimedias	: [{
			_id			: Schema.ObjectId,
			name 		: {type : String, trim : true},
			descripton 	: String,
			type 		: {type : String, enum : ['IMAGE','VIDEO','AUDIO','BINARY']},
			url 		: {type : String, trim : true}
		}],

		objectives : [{
			_id				: Schema.ObjectId,
			name 			: {type : String, trim : true},
			description 	: String,
			creationDate 	: {type : Date, default : Date.now},
			multimedias		: [Schema.ObjectId],
			authors 		: [Schema.ObjectId],
			sources			: [Schema.ObjectId],
			parentObjective : {type : Schema.ObjectId, default : null}
		}],

		storageRequirements	: [{
			_id				: Schema.ObjectId,
			name 			: {type : String, trim : true},
			description 	: String,
			creationDate 	: {type : Date, default : Date.now},
			x				: Number,
			y				: Number,
			width			: Number,
			height			: Number,
			multimedias		: [Schema.ObjectId],
			authors 		: [Schema.ObjectId],
			sources			: [Schema.ObjectId],
			attributes 		: [{  //Class Attributes
				name 			: {type : String, trim : true},
				type			: {type : String, enum : [
									'INT',
									'HTML',
									'FILE',																
									'ENUM',
									'IMAGE',
									'STRING',								
									'DECIMAL',
									'POSITION',
									'TIMESTAMP',]},
				enumerationId	: {type:Schema.ObjectId,default:null}
			}]
		}],

		functionalRequirements : [{
			_id				: Schema.ObjectId,
			name 			: {type : String, trim : true},
			description 	: String,
			creationDate 	: {type : Date, default : Date.now},
			x				: Number,
			y				: Number,
			width			: Number,
			height			: Number,
			multimedias		: [Schema.ObjectId],
			authors 		: [Schema.ObjectId],
			sources			: [Schema.ObjectId],
			diagramActivity : [{
				type 		: {type : String, enum : ['GENERAL','SPECIFIC']},
				activities	: [{
					operation			: {type : String, enum : ['CREATE','READ','UPDATE','DELETE']},
					storageRequirement 	: Schema.ObjectId, 
					readMethod			: {	type : String, 
											enum : ['GENERAL','SPECIFIC','SESSION','NO APPLY'], 
											default: 'NO APPLY'}
				}]
			}]
		}],

		nonFunctionalRequirements : [{
			_id				: Schema.ObjectId,
			name 			: {type : String, trim : true},
			description 	: String,
			creationDate 	: {type : Date, default : Date.now},
			multimedias		: [Schema.ObjectId],
			authors 		: [Schema.ObjectId],
			sources			: [Schema.ObjectId]
		}],

		actors : [{
			_id				: Schema.ObjectId,
			name 			: {type : String, trim : true},
			description 	: String,
			creationDate 	: {type : Date, default : Date.now},
			x				: Number,
			y				: Number,
			width			: Number,
			height			: Number,
			multimedias		: [Schema.ObjectId],
			authors 		: [Schema.ObjectId],
			sources			: [Schema.ObjectId]
		}],

		classAssociations : [{
			_id				: Schema.ObjectId,
			type 			: {type : String, enum : ['CAN','EXTENDS']}, //CAN     : for actor-use_case
																		 //EXTENDS : for use_case - use_case
			useCase 		: Schema.ObjectId, 							 //Functional Requirement
			extendedUseCase : {type : Schema.ObjectId, default : null }, //Functional Requirement
			actor 			: Schema.ObjectId
		}],

		useCaseAssociations : [{
			_id		: Schema.ObjectId,
			type 	: {type : String, enum : ['AGGREGATION']},
			classA 	: Schema.ObjectId, //Storage Requirement
			classB 	: Schema.ObjectId  //Storage Requirement
		}],

		enumerations : [{
			_id		: Schema.ObjectId,
			name 	: {type : String, trim : true},
			values 	: [String]
		}]

	});

	return mongoose.model('Project',projectSchema);
})();