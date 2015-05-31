var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var storageRequirementSchema = Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		special			: {type : String, default : null, enum : [null, 'USER', 'ROLE']},
		x				: Number,
		y				: Number,
		width			: Number,
		height			: Number,
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}],
		attributes 		: [{  //Class Attributes
			type : Schema.ObjectId, 
			ref  : 'Attribute'
		}],
	});

	var StorageRequirement = mongoose.model('StorageRequirement',storageRequirementSchema);

	StorageRequirement.create = function(projectId,data,fn,notifyAll){
		async.waterfall([
			function(next){
				var storageRequirement = new StorageRequirement(data);
				storageRequirement.save(function (error, storageRequirement) {	
					notifyAll({
						model  : "StorageRequirement",
						method : "create",
						data   : storageRequirement,
					});
					next(error,storageRequirement);					
				});
			},
			function(storageRequirement,next){
				Project.findById(projectId,function(error,project){
					next(error,project,storageRequirement);
				});
			},
			function(project,storageRequirement,next){
				project.storageRequirements.push(storageRequirement);
				project.save(function(error){
					next(error,storageRequirement);
				});
			}
		],function(error,storageRequirement){
			if(error)return console.error(error);
			fn(storageRequirement);
		});
	}

	StorageRequirement.update = function(id,data,next){
		StorageRequirement.findById(id,function(err,storageRequirement){
			Object.keys(data).forEach(function(attr){
				storageRequirement[attr]=data[attr];
			});
			storageRequirement.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	return StorageRequirement;
})();