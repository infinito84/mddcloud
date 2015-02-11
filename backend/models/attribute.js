var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var attributeSchema=Schema({
		name 			: {type : String, trim : true},
		type			: {type : String, enum : [
							'INT','HTML','FILE','ENUM',
							'IMAGE','STRING','DECIMAL',
							'POSITION','TIMESTAMP'
						  ]},
		enumeration		: {type : Schema.ObjectId, ref : 'Enumeration', default:null}
	});

	return mongoose.model('Attribute',attributeSchema);
})();