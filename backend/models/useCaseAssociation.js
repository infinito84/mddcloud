var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var useCaseAssociationSchema=Schema({
		useCase 		: {type : Schema.ObjectId, ref : 'FunctionalRequirement'},
		actor 			: {type : Schema.ObjectId, ref : 'Actor'}
	});

	var UseCaseAssociation = mongoose.model('UseCaseAssociation',useCaseAssociationSchema);

	UseCaseAssociation.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var useCaseAssociation = new UseCaseAssociation(data);
				useCaseAssociation.save(function (error, useCaseAssociation) {	
					notifyAll({
						model  : "UseCaseAssociation",
						method : "create",
						data   : useCaseAssociation,
					});
					next(error,useCaseAssociation);					
				});
			},
			function(useCaseAssociation,next){
				Project.findById(projectId,function(error,project){
					next(error,project,useCaseAssociation);
				});
			},
			function(project,useCaseAssociation,next){
				project.useCaseAssociations.push(useCaseAssociation);
				project.save(function(error){
					next(error,useCaseAssociation);
				});
			}
		],function(error,useCaseAssociation){
			if(error)return console.error(error);
			fn(useCaseAssociation);
		});
	}

	UseCaseAssociation.delete = function (projectId,id,fn){
		async.waterfall([
			function(next){
				UseCaseAssociation.findById(id,function(error,useCaseAssociation){
					next(error,useCaseAssociation)
				});
			},
			function(useCaseAssociation,next){
				Project.findById(projectId,function(error,project){
					next(error,project,useCaseAssociation);
				});
			},
			function(project,useCaseAssociation,next){
				project.useCaseAssociations.remove(useCaseAssociation);
				project.save(function(error){
					next(error,useCaseAssociation);
				});
			},
			function(useCaseAssociation,next){
				useCaseAssociation.remove(function(error){
					next(error);
				});
			}
		],function(error){
			if(error)return console.error(error);
			fn();
		});
	}

	return UseCaseAssociation;
})();