var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var nonFunctionalRequirementSchema = Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}]
	});

	var NonFunctionalRequirement = mongoose.model('NonFunctionalRequirement',nonFunctionalRequirementSchema);

	NonFunctionalRequirement.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var nonFunctionalRequirement = new NonFunctionalRequirement(data);
				nonFunctionalRequirement.save(function (error, nonFunctionalRequirement) {	
					notifyAll({
						model  : "NonFunctionalRequirement",
						method : "create",
						data   : nonFunctionalRequirement,
					});
					next(error,nonFunctionalRequirement);					
				});
			},
			function(nonFunctionalRequirement,next){
				Project.findById(projectId,function(error,project){
					next(error,project,nonFunctionalRequirement);
				});
			},
			function(project,nonFunctionalRequirement,next){
				project.nonFunctionalRequirements.push(nonFunctionalRequirement);
				project.save(function(error){
					next(error,nonFunctionalRequirement);
				});
			}
		],function(error,nonFunctionalRequirement){
			if(error)return console.error(error);
			fn(nonFunctionalRequirement);
		});
	}

	NonFunctionalRequirement.update = function(id,data,next){
		NonFunctionalRequirement.findById(id,function(err,nonFunctionalRequirement){
			Object.keys(data).forEach(function(attr){
				nonFunctionalRequirement[attr]=data[attr];
			});
			nonFunctionalRequirement.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return NonFunctionalRequirement;
})();