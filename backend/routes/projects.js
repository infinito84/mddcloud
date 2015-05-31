var express				= require('express'),
	async 				= require('async'),
	app 				= require('../app/server'),
	utils 				= require('../app/utils'),
	User 				= require('../models/user'),
	Project 			= require('../models/project'),
	Participant 		= require('../models/participant'),
	StorageRequirement 	= require('../models/storageRequirement'),
	Attribute 			= require('../models/attribute'),
	ClassAssociation	= require('../models/classAssociation');

module.exports=(function(){
	var router = express.Router();

	router.get('/projects', app.isAuthenticated, function(req, res) {
		Participant.find({user : req.user._id})
		.deepPopulate('project')
		.exec(function (error,participants) {
			res.render('projects', {
				layout 			: 'private', 
				user 			: req.user,
				participants	: participants
			});
		});				
	});

	router.post('/project/create/', app.isAuthenticated, function(req, res){
		async.waterfall([
			function(callback){
				new Project({
					name : req.body.name
				}).save(function(error, project){
					callback(error, project);
				});
			},
			function(project, callback){
				projectTemp = project;
				new Participant({
					project : project._id,
					user 	: req.user._id,
					role	: 'ADMIN'
				}).save(function(error, participant){
					callback(error, participant, project);
				});
			},
			function(participant, project, callback){
				project.participants.push(participant._id);
				project.save(function(error){
					callback(error, project);
				});
			},
			function(project, callback){
				new Attribute({
					name : 'username',
					type : 'STRING'
				}).save(function(error, user){
					callback(error, project, user);
				});
			},
			function(project, user,callback){
				new Attribute({
					name : 'password',
					type : 'PASSWORD'
				}).save(function(error,password){
					callback(error, project, user, password);
				});
			},
			function(project, user, password, callback){
				new StorageRequirement({
					name 		: req.i18n.t('User'),
					description : req.i18n.t('This storage requirement represents the users of your system'),
					special 	: 'USER',
					x 			: 100,
					y 			: 300,
					width 		: 90,
					height 		: 60,
					attributes 	: [user._id, password._id]
				}).save(function(error,user){
					callback(error, project, user);
				});
			},
			function(project, user,callback){
				new Attribute({
					name : 'name',
					type : 'STRING'
				}).save(function(error,name){
					callback(error, project, user, name);
				});
			},
			function(project, user, name, callback){
				new StorageRequirement({
					name 		: req.i18n.t('Role'),
					description : req.i18n.t('This storage requirement represents the actors of your system'),
					special 	: 'ROLE',
					x 			: 110,
					y 			: 100,
					width 		: 130,
					height 		: 60,
					attributes 	: [name._id]
				}).save(function(error,role){
					callback(error, project, user, role);
				});
			},
			function(project, user, role, callback){
				project.storageRequirements.push(user._id);
				project.storageRequirements.push(role._id);
				project.save(function(error){
					callback(error, project, user, role);
				});
			},
			function(project, user, role, callback){
				new ClassAssociation({
					type   : 'ONE_TO_MANY',
					classA : role._id,
					classB : user._id,
				}).save(function(error, association){
					callback(error, project, association);
				});
			},
			function(project, association, callback){
				project.classAssociations.push(association._id);
				project.save(function(error){
					callback(error,project);
				});
			},
		],function(error, project){
			if(error){
				console.error(error);
			}
			res.redirect('/mddcloud/'+ project._id + '#project');
		});
	});

	app.use('/', router);
	return router;
})();
