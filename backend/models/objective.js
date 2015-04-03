var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var objectiveSchema  =Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}],
		parentObjective : {type : Schema.ObjectId, ref : 'Objective', default : null}
	});

	var Objective = mongoose.model('Objective',objectiveSchema);

	Objective.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var objective = new Objective(data);
				objective.save(function (error, objective) {	
					notifyAll({
						model  : "Objective",
						method : "create",
						data   : objective,
					})
					next(error,objective);					
				});
			},
			function(objective,next){
				Project.findById(projectId,function(error,project){
					next(error,project,objective);
				});
			},
			function(project,objective,next){
				project.objectives.push(objective);
				project.save(function(error){
					next(error,objective);
				});
			}
		],function(error,objective){
			if(error)return console.error(error);
			fn(objective);
		});
	}

	Objective.update = function(id,data,next){
		Objective.findById(id,function(err,objective){
			Object.keys(data).forEach(function(attr){
				objective[attr]=data[attr];
			});
			objective.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return Objective;
})();