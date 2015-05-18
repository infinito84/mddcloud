var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var ActorSchema=Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		x				: Number,
		y				: Number,
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}]
	});

	var Actor = mongoose.model('Actor',ActorSchema);

	Actor.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var actor = new Actor(data);
				actor.save(function (error, actor) {	
					notifyAll({
						model  : "Actor",
						method : "create",
						data   : actor,
					});
					next(error,actor);					
				});
			},
			function(actor,next){
				Project.findById(projectId,function(error,project){
					next(error,project,actor);
				});
			},
			function(project,actor,next){
				project.actors.push(actor);
				project.save(function(error){
					next(error,actor);
				});
			}
		],function(error,actor){
			if(error)return console.error(error);
			fn(actor);
		});
	}

	Actor.update = function(id,data,next){
		Actor.findById(id,function(err,actor){
			Object.keys(data).forEach(function(attr){
				actor[attr]=data[attr];
			});
			actor.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return Actor;
})();