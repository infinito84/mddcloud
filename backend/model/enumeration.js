var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var enumerationSchema=Schema({
		name 	: {type : String, trim : true},
		values 	: [{type : String, trim : true}]
	});

	return mongoose.model('Enumeration',enumerationSchema);
})();