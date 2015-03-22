var mongoose = require('mongoose'),
	jsonpath = require('jsonpath'),
	Schema 	 = mongoose.Schema;


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

	var Project = mongoose.model('Project',projectSchema);

	Project.update = function(id,data,next){
		Project.findById(id,function(err,project){
			Object.keys(data).forEach(function(attr){
				project[attr]=data[attr];
			});
			project.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	Project.checkDeep = function(project,deepPopulate,query,callback){
		Project.findById(project)
			.deepPopulate(deepPopulate)
			.exec(function (error,project) {
				if (error){
					callback('Internal error');
					return;
				}
				if (project) {
					var result = jsonpath.query(project,query);
					if(result===undefined){
						callback("Error with query: "+query);
					}
					else{
						callback(null,result.length !== 0);
					}
				}
				else{
					callback('Dont\'s exits project: '+project+'!');
				}
			});	
	}

	return Project;
})();