var Participant = require('./participant'),
	Project 	= require('./project'),
	User 		= require('./user'),
	crypto		= require('crypto'),
	async 		= require('async')

var user1;
var project1;
var participant1;
var test = true;

if(test){
	async.series({
		user1 : function(callback){
			user1 = new User({
				name 		: 'Sergio Andrés Ñustes',
				email 		: 'infinito84@gmail.com',
				password 	: crypto.createHash('md5').update('*****').digest('hex')
			});
			user1.save(function(){
				callback();
			});
		},
		participant1 : function(callback){
			participant1 = new Participant({
				user : user1,
				role : 'ADMIN'
			});
			participant1.save(function(){
				callback();
			});
		},
		project1 : function(callback){
			project1 = new Project({
				name 		 : 'Example Project',
				description	 : 'This project is a test'
			});
			project1.participants.push(participant1);
			project1.save(function(){
				callback();
			})
		}
	});
}