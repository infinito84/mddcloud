var mongoose= require('mongoose'),
	Schema 	= mongoose.Schema,
	async 	= require("async"),
	Project = require("./project.js");

module.exports=(function(){
	var enumerationSchema=Schema({
		name 	: {type : String, trim : true},
		values 	: [{type : String, trim : true}]
	});

	var Enumeration = mongoose.model('Enumeration',enumerationSchema);

	Enumeration.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var enumeration = new Enumeration(data);
				enumeration.save(function (error, enumeration) {	
					notifyAll({
						model  : "Enumeration",
						method : "create",
						data   : enumeration,
					})
					next(error,enumeration);					
				});
			},
			function(enumeration,next){
				Project.findById(projectId,function(error,project){
					next(error,project,enumeration);
				});
			},
			function(project,enumeration,next){
				project.enumerations.push(enumeration);
				project.save(function(error){
					next(error,enumeration);
				});
			}
		],function(error,enumeration){
			if(error)return console.error(error);
			fn(enumeration._id);
		});
	}

	Enumeration.update = function(id,data,next){
		Enumeration.findById(id,function(err,enumeration){
			Object.keys(data).forEach(function(attr){
				enumeration[attr]=data[attr];
			});
			enumeration.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	Enumeration.delete = function (projectId,id,fn){
		async.waterfall([
			function(next){
				Enumeration.findById(id,function(error,enumeration){
					next(error,enumeration)
				});
			},
			function(enumeration,next){
				Project.findById(projectId,function(error,project){
					next(error,project,enumeration);
				});
			},
			function(project,enumeration,next){
				project.enumerations.remove(enumeration);
				project.save(function(error){
					next(error,enumeration);
				});
			},
			function(enumeration,next){
				enumeration.remove(function(error){
					next(error);
				});
			}
		],function(error){
			if(error)return console.error(error);
			fn();
		});
	}

	return Enumeration;
})();