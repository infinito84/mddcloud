var mongoose 	= require('mongoose');
	Schema 	 	= mongoose.Schema,
	async		= require('async'),
	Project 	= require('./project');

module.exports=(function(){
	var multimediaSchema=Schema({
		name 		: {type : String, trim : true},
		description	: String,
		type 		: {type : String, enum : ['IMAGE','VIDEO','AUDIO','BINARY']},
		url 		: {type : String, trim : true}
	});

	var Multimedia = mongoose.model('Multimedia',multimediaSchema);

	Multimedia.create = function(projectId,data,notifyAll){
		async.waterfall([
			function(next){
				var multimedia = new Multimedia(data);
				multimedia.save(function (error, multimedia) {	
					notifyAll({
						model  : "Multimedia",
						method : "create",
						data   : multimedia,
					})
					next(error,multimedia);					
				});
			},
			function(multimedia,next){
				Project.findById(projectId,function(error,project){
					next(error,project,multimedia);
				});
			},
			function(project,multimedia,next){
				project.multimedias.push(multimedia);
				project.save(function(error){
					next(error);
				});
			}
		],function(error){
			if(error)return console.error(error);
		});
	}

	Multimedia.update = function(id,data,next){
		Multimedia.findById(id,function(err,multimedia){
			Object.keys(data).forEach(function(attr){
				multimedia[attr]=data[attr];
			});
			multimedia.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return Multimedia;
})();