var Project = require('./projectSchema'),
	User 	= require('./userSchema'),
	crypto	= require('crypto'),
	async 	= require('async')

var user1;
var project1;

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
	project1 : function(callback){
		project1 = new Project({
			name 		 : 'Example Project',
			description	 : 'This project is a test',
			participants : [{
				userId	 : user1._id,
				role 	 : 'ADMIN'
			}]
		});
		project1.save(function(){
			callback();
		})
	}
},function(){
	console.log(user1);
	console.log(project1);
});