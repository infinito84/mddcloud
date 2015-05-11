var mongoose	= require('mongoose'),
	async 		= require('async'),
	Schema 		= mongoose.Schema,
	Project 	= require("./project.js");

module.exports=(function(){
	var participantSchema=Schema({
		creationDate 	: {type : Date, default : Date.now},
		status			: {type : String, enum : ['ENABLED','DISABLED'], default : 'ENABLED'},
		role			: {type : String, enum : ['EDITOR','READER','ADMIN']},
		user			: {type : Schema.ObjectId, ref : "User"},
		project			: {type : Schema.ObjectId, ref : "Project"},
	});

	var Participant = mongoose.model('Participant',participantSchema);

	Participant.update = function(id,data,next){
		Participant.findById(id,function(err,participant){
			Object.keys(data).forEach(function(attr){
				participant[attr]=data[attr];
			});
			participant.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	Participant.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var participant = new Participant(data);
				participant.save(function (error, participant) {	
					notifyAll({
						model  : "Participant",
						method : "create",
						data   : participant,
					})
					next(error,participant);					
				});
			},
			function(participant,next){
				Project.findById(projectId,function(error,project){
					next(error,project,participant);
				});
			},
			function(project,participant,next){
				project.participants.push(participant);
				console.log("hasta aquí");
				project.save(function(error){
					next(error,participant);
				});
			}
		],function(error,participant){
			if(error)return console.error(error);
			fn(participant);
		});
	}

	return Participant;
})();