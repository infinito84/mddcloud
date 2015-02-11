var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

module.exports=(function(){
	var ActorSchema=Schema({
		name 			: {type : String, trim : true},
		description 	: String,
		creationDate 	: {type : Date, default : Date.now},
		x				: Number,
		y				: Number,
		width			: Number,
		height			: Number,
		multimedias		: [{type : Schema.ObjectId, ref : 'Multimedia'}],
		authors 		: [{type : Schema.ObjectId, ref : 'User'}],
		sources			: [{type : Schema.ObjectId, ref : 'User'}]
	});

	return mongoose.model('Actor',ActorSchema);
})();