var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var functionalRequirementSchema = Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		x				: Number,
		y				: Number,
		width			: Number,
		height			: Number,
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}],
		actions 		: [{
			type : Schema.ObjectId,
			ref  : 'Action'
		}]
	});

	var FunctionalRequirement = mongoose.model('FunctionalRequirement',functionalRequirementSchema);

	FunctionalRequirement.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var functionalRequirement = new FunctionalRequirement(data);
				functionalRequirement.save(function (error, functionalRequirement) {	
					notifyAll({
						model  : "FunctionalRequirement",
						method : "create",
						data   : functionalRequirement,
					});
					next(error,functionalRequirement);					
				});
			},
			function(functionalRequirement,next){
				Project.findById(projectId,function(error,project){
					next(error,project,functionalRequirement);
				});
			},
			function(project,functionalRequirement,next){
				project.functionalRequirements.push(functionalRequirement);
				project.save(function(error){
					next(error,functionalRequirement);
				});
			}
		],function(error,functionalRequirement){
			if(error)return console.error(error);
			fn(functionalRequirement);
		});
	}

	FunctionalRequirement.update = function(id,data,next){
		FunctionalRequirement.findById(id,function(err,functionalRequirement){
			Object.keys(data).forEach(function(attr){
				functionalRequirement[attr]=data[attr];
			});
			functionalRequirement.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return FunctionalRequirement;
})();