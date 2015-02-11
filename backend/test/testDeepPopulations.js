var express		= require('express'),
	mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema,
	ObjectId 	= mongoose.Types.ObjectId,
	async 		= require('async');

mongoose.connect('mongodb://localhost/engines'+parseInt(Math.random()*1000));

console.log('Defining schemas')

var engineSchema = new Schema({
	name 				: {type: String},
	serial 				: {type: String},
	inventory 			: {type: String},
	label 				: {type: String},
	engineProperties 	: {type: Schema.ObjectId, ref: 'Engineproperties'}
});

engineSchema.plugin(require('mongoose-deep-populate'));

var Engine = mongoose.model('Engine',engineSchema);

var Engineproperties = mongoose.model('Engineproperties',new Schema({
	model 			: {type: String},
	description 	: {type: String},
	manufacturers 	: {type: Schema.ObjectId, ref: 'Manufacturers'}
}));

var Manufacturers = mongoose.model('Manufacturers',new Schema({
	name 		: {type: String},
	address 	: {type: String},
	postcode 	: {type: String},
	city 		: {type: String},
	phone 		: {type: String},
	fax 		: {type: String},
	email 		: [{type: String}]
}));

console.log('Saving data');
async.series({
	engine1 : function(callback){
		new Engine({
			_id 				: new ObjectId('5484d382a3ad22c064e04ad9'),
			serial 				: '78615616',
			inventory 			: '786156',
			label 				: '45',
			engineProperties 	: new ObjectId('5483512913411de34d47252f')
		}).save(function(error){
			callback(error);
		});
	},
	engine2 : function(callback){
		new Engine({
			_id 				: new ObjectId('5499f57afdedd69d46edd869'),
			serial 				: '4561506',
			inventory 			: '786156',
			label 				: '12',
			engineProperties 	: new ObjectId('547a39bb13411d1f4b737b96')
		}).save(function(error){
			callback(error);
		});
	},
	properties1 : function(callback){
		new Engineproperties({
			_id 			: new ObjectId('5483512913411de34d47252f'),
			model 			: 'Nimbus',
			description		: 'Des nimbus',
			manufacturers	: new ObjectId('548351291341112345678910')
		}).save(function(error){
			callback(error);
		});
	},
	properties2 : function(callback){
		new Engineproperties({
			_id 			: new ObjectId('547a39bb13411d1f4b737b96'),
			model 			: 'Modena',
			description		: 'Une description à la con',
			manufacturers	: new ObjectId('547a38f813411dc14e737b97')
		}).save(function(error){
			callback(error);
		});
	},
	manufacter1 : function(callback){
		new Manufacturers({
			_id 		: new ObjectId('548351291341112345678910'),
			name 		: 'Sergio',
			address		: 'cr 1',
			postcode 	: '0000',
			city 		: 'Bogotá',
			phone 		: '+0000',
			fax 		: '+1234',
			email 		: [
				'infinito84@gmail.com'
			]
		}).save(function(error){
			callback(error);
		});
	},
	manufacter2 : function(callback){
		new Manufacturers({
			_id 		: new ObjectId('547a38f813411dc14e737b97'),
			name 		: 'Diffusion Technique Française',
			address		: '19 Rue de la Presse',
			postcode 	: '42000',
			city 		: 'Saint-Etienne',
			phone 		: '+3345648465',
			fax 		: '+3345656458',
			email 		: [
				'abc@mail.com'
			]
		}).save(function(error){
			callback(error);
		});
	},

},function(error){
	if(error)console.error(error);

	/*Engine.find()
	.deepPopulate('engineProperties.manufacturers')
	.exec(function (error, data) {
		console.log('Showing all data');
		console.log(data);
	});*/

	
	Engine.find({})
	.deepPopulate('engineProperties.manufacturers', {
		populate: {
			engineProperties : {
				match : {
					manufacturers : new ObjectId('547a38f813411dc14e737b97'),
				}
			}
		}
	})
	.exec(function (error, data) {
		data = data.filter(function(engine){
			return engine.engineProperties;
		});
		console.log(data);
	});
});



