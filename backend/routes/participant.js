var express				= require('express'),
	app 				= require('../app/server'),
	async 				= require('async'),
	User 				= require('../models/user'),
	Project 			= require('../models/project'),
	Participant 		= require('../models/participant'),
	availableSockets 	= require('../app/availableSockets');

module.exports=(function(){
	var router = express.Router();
	router.post('/add/', function(req, res) {
		var email = req.body.email;
		var role  = req.body.role;
		var project = req.body.project;
		var sockets = availableSockets.getAll(project);
		var socket = availableSockets.getOwn(project,req.sessionID);
		async.waterfall([
			function(callback){
				User.findOne({email : email},function(error,user){
					if(user){
						callback(null,user,true);
					}
					else{
						var user = new User({
							name  : email,
							email : email
						});
						user.save(function (error, user) {	
							if(error){
								callback(error);
							}
							else{
								availableSockets.notifyAll(sockets,{
									model  : "User",
									method : "create",
									data   : user,
								})
								callback(null,user,false);					
							}
						});
					}
				});
			},
			function(user,validate,callback){
				if(validate){
					Project.checkDeep(project,"participants","$.participants[?(@.user == '"+user._id+"')]",function(error,exists){
						if(error)callback(error);
						else{
							if(!exists){
								availableSockets.notifyAll(sockets,{
									model  : "User",
									method : "create",
									data   : user,
								})
								callback(null,user);
							}
							else{
								callback(req.i18n.t('The user is already asociated to the project'));
							}
						}
					});
				}
				else{
					callback(null,user);
				}
			},
			function(user,callback){
				Participant.create(project,{
					role  	: role,
					user  	: user._id,
					project : project
				},function(){
					callback(null,user);
				},function(params){
					availableSockets.notifyAll(sockets,params);
				});
			}
		],function(error,user){
			if(error){
				res.status(500).send(error);
			}
			else{
				res.send("Ok");
				Project.findById(project,function(error,project){
					app.nodemailer.sendMail({
						from	: 'MDDCloud <mddcloud.org',
						to		: user.name + ' <' + user.email + '>',
						subject	: req.i18n.t('Invitation to participate'),
						template: 'emailParticipation',
						context	: {
							name 		: user.name,
							project 	: project.name,
							description	: project.description,
							role 		: role,
							link 		: app.config.host + 'projects'
						}
					},function(error,info){
						if(error){
							console.log("nodemailer: "+error);
						}
						else{
							socket.emit('info',req.i18n.t('A email has sended to')+': '+email);
						}
					});
				});
			}
		});
	});

	router.get('/all/', function(req, res) {
		req.send("Muy bien!");
	});

	app.use('/participant', router);
	return router;
})();
