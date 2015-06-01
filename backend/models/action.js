var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var activitySchema=Schema({
		operation			: {type : String, enum : ['CREATE','READ','UPDATE','DELETE','START','END']},
		storageRequirement 	: {type : Schema.ObjectId, ref : 'StorageRequirement', default : null},
		readMethod			: {	
								type : String, 
								enum : ['GENERAL','SPECIFIC','SESSION','NO APPLY'], 
								default: 'NO APPLY'
							  },
		x 					: Number,
		y 					: Number,
		width 				: Number,
		height 				: Number,
		parentAction 		: {type : Schema.ObjectId, ref : 'Action', default : null},
	});

	var Action = mongoose.model('Action',activitySchema);

	Action.create = function(projectId,data,fn,notifyAll){
		var action = new Action(data);
		action.save(function (error, action) {	
			if(error)return console.error(error);
			notifyAll({
				model  : "Action",
				method : "create",
				data   : action,
			})					
			fn(action);					
		});
	}

	Action.update = function(id,data,next){
		Action.findById(id,function(err,action){
			Object.keys(data).forEach(function(attr){
				action[attr]=data[attr];
			});
			action.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	Action.delete = function (projectId,id,fn){
		Action.findById(id,function(error,action){
			action.remove(function(error){
				if(error)return console.error(error);
				fn();
			});
		});
	}

	return Action;
})();