var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var attributeSchema=Schema({
		name 		: {type : String, trim : true},
		type		: {type : String, enum : [
						'INT','HTML','FILE','ENUM',
						'IMAGE','STRING','DECIMAL',
						'POSITION','TIMESTAMP', 'PASSWORD'
					]},
		enumeration	: {type : Schema.ObjectId, ref : 'Enumeration', default:null}
	});

	var Attribute = mongoose.model('Attribute',attributeSchema);

	Attribute.create = function(projectId,data,fn,notifyAll){
		var attribute = new Attribute(data);
		attribute.save(function (error, attribute) {	
			if(error)return console.error(error);
			notifyAll({
				model  : "Attribute",
				method : "create",
				data   : attribute,
			})					
			fn(attribute);					
		});
	}

	Attribute.update = function(id,data,next){
		Attribute.findById(id,function(err,attribute){
			Object.keys(data).forEach(function(attr){
				attribute[attr]=data[attr];
			});
			attribute.save(function(error){
				if (error) return console.error(error);
				next();
			});
		});
	}

	Attribute.delete = function (projectId,id,fn){
		Attribute.findById(id,function(error,attribute){
			attribute.remove(function(error){
				if(error)return console.error(error);
				fn();
			});
		});
	}

	return Attribute;
})();

