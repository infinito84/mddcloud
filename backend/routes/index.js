var express		= require('express'),
	app 		= require('../app/server'),
	utils 		= require('../app/utils'),
	User 		= require('../models/user'),
	Project 	= require('../models/project'),
	Participant = require('../models/participant');

module.exports=(function(){
	var router = express.Router();

	router.get('/', function(req, res) {
		res.render('index');
	});

	router.post('/demo/', function(req, res) {
		req.session.project = '54bdd57ddbebd1c00bad7ab3';
		req.session.sessionID = req.sessionID;
		var role = req.body.role;
		var email = req.body.email;
		async.waterfall([
			function(callback){
				User.findOne({email : email},function(error,user){
					if(user){
						callback(null,user);
					}
					else{
						var user = new User({
							name  : email,
							email : email,
							image : 'http://www.gravatar.com/avatar/'+ utils.md5(email.trim()) +'?d=mm'
						});
						user.save(callback);
					}
				});
			},
			function(user,callback){
				req.session.user = user._id;
				Participant.findOne({user : user._id},function(error,participant){
					if(user){
						Participant.update(participant._id, {role : role}, callback);
					}
					else{
						Participant.create(project,{
							role  	: role,
							user  	: user._id,
							project : project
						},callback,function(params){})
					}
				});
			}
		],function(error,user){
			res.render('mddcloud');
		});		
	});
	app.use('/', router);
	return router;
})();
