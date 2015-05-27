var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var classAssociationSchema=Schema({
		type 	: {type : String, enum : ['ONE_TO_ONE','ONE_TO_MANY']},
		classA 	: {type : Schema.ObjectId, ref : 'StorageRequirement'},
		classB 	: {type : Schema.ObjectId, ref : 'StorageRequirement'}
	});

	var ClassAssociation = mongoose.model('ClassAssociation',classAssociationSchema);

	ClassAssociation.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var classAssociation = new ClassAssociation(data);
				classAssociation.save(function (error, classAssociation) {	
					notifyAll({
						model  : "ClassAssociation",
						method : "create",
						data   : classAssociation,
					});
					next(error,classAssociation);					
				});
			},
			function(classAssociation,next){
				Project.findById(projectId,function(error,project){
					next(error,project,classAssociation);
				});
			},
			function(project,classAssociation,next){
				project.classAssociations.push(classAssociation);
				project.save(function(error){
					next(error,classAssociation);
				});
			}
		],function(error,classAssociation){
			if(error)return console.error(error);
			fn(classAssociation);
		});
	}

	ClassAssociation.delete = function (projectId,id,fn){
		async.waterfall([
			function(next){
				ClassAssociation.findById(id,function(error,classAssociation){
					next(error,classAssociation)
				});
			},
			function(classAssociation,next){
				Project.findById(projectId,function(error,project){
					next(error,project,classAssociation);
				});
			},
			function(project,classAssociation,next){
				project.classAssociations.remove(classAssociation);
				project.save(function(error){
					next(error,classAssociation);
				});
			},
			function(classAssociation,next){
				classAssociation.remove(function(error){
					next(error);
				});
			}
		],function(error){
			if(error)return console.error(error);
			fn();
		});
	}

	return ClassAssociation;
})();