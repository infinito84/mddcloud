var Handlebars 	= require('handlebars'),
	Project		= require('../models/project'),
	helpers 	= require('../app/helpersHandlebars'),
	config		= require('./config'),
	mkdirp		= require('mkdirp'),
	async		= require('async'),	
	exec		= require('exec'),
	fs 			= require('fs');

var deepPopulateArray = [
	'participants.user',
	'actors',
	'multimedias',
	'objectives',
	'storageRequirements.attributes.enumeration',
	'functionalRequirements.actions',
	'nonFunctionalRequirements',
	'useCaseAssociations',
	'classAssociations.classA',
	'classAssociations.classB',
];

for(var name in helpers){
	Handlebars.registerHelper(name, helpers[name]);
}

var templateFile = function(name){
	return fs.readFileSync(config.folder +'backend/web_app_generation/'+ name +'.hbs', {encoding : 'UTF-8'});
}

module.exports = function(){	
	var projectId = this.projectId;
	var socket = this.socket;
	var folder = config.folderApps + projectId +'/';
	socket.emit('info','Starting...');
	Project.findById(projectId)
	.deepPopulate(deepPopulateArray)
	.exec(function (error,project) {
		if (error){
			callback('Internal error');
			return;
		}
		project.mysql = {
			user : config.mysql.user,
			pass : config.mysql.password
		};
		async.series([
			function(callback){
				exec('rm -rf '+ folder,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info','Creating folder project');
				mkdirp(folder,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info','Copying framework');
				exec('cp -rf '+ config.framework +'* '+ folder,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info','Generating SQL');
				var text = templateFile('sql');
				var template = Handlebars.compile(text);
				fs.writeFile(folder + 'database.sql', template(project), function () {
					callback();
				});
			},
			function(callback){
				socket.emit('info','Creating database');
				var user = config.mysql.user;
				var pass = config.mysql.password;
				exec('mysql -u'+ user +' -p'+ pass +' < '+ folder +'database.sql',function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info','Generating models');
				var text = templateFile('model');
				var template = Handlebars.compile(text);
				var total = 0;
				for(var i=0; i<project.storageRequirements.length; i++){
					var storage = project.storageRequirements[i];
					var file = 'models/' + helpers.className(storage.name) +'.php';
					fs.writeFile(folder +file , template(storage), function () {
						total++;
						if(total === project.storageRequirements.length){
							callback();
						}
					});
				}
			},
			function(callback){
				socket.emit('info', 'Generating controllers');
				var text = templateFile('controller');
				var template = Handlebars.compile(text);
				var total = 0;
				var file;
				var limit = project.functionalRequirements.length + project.actors.length + 1;
				
				//Generating a controller for each functional requirement
				for(var i=0; i<project.functionalRequirements.length; i++){
					var requirement = project.functionalRequirements[i];
					file = 'controllers/'+ helpers.className(requirement.name) +'Controller.php';
					requirement.roles = project.useCaseAssociations.filter(function(association){
						return association.useCase.toString() === requirement._id.toString();
					}).map(function(association){
						for(var j=0; j<project.actors.length; j++){
							var actor = project.actors[j];
							if(actor._id.toString() === association.actor.toString()	){
								return helpers.roleName(actor.name);
							}
						}
						return '';
					});
					fs.writeFile(folder +file , template(requirement), function () {
						total++;
						if(total === limit){
							callback();
						}
					});
				}

				//Generating a controller for each role
				text = templateFile('role_controller');
				template = Handlebars.compile(text);
				for(var i=0; i<project.actors.length; i++){
					var actor = project.actors[i];
					file = 'controllers/'+ helpers.className(actor.name) +'Controller.php';
					actor.roles = [helpers.roleName(actor.name)]
					fs.writeFile(folder +file , template(actor), function () {
						total++;
						if(total === limit){
							callback();
						}
					});
				}

				//Generating Index Controller
				text = templateFile('index_controller');
				template = Handlebars.compile(text);
				file = 'controllers/IndexController.php';
				fs.writeFile(folder +file , template(project), function () {
					total++;
					if(total === limit){
						callback();
					}
				});
			},
			function(callback){
				socket.emit('info','Creating views\' folders');
				var total = 0;
				var limit = project.functionalRequirements.length + project.actors.length + 1;
				var file = '/views/index/';
				mkdirp(folder + file ,function(){
					total++;
					if(total === limit){
						callback();
					}
				});
				for(var i=0; i<project.functionalRequirements.length; i++){
					var requirement = project.functionalRequirements[i];
					file = '/views/'+ helpers.friendlyUrl(requirement.name);
					mkdirp(folder + file ,function(){
						total++;
						if(total === limit){
							callback();
						}
					});
				}
				for(var i=0; i<project.actors.length; i++){
					var actor = project.actors[i];
					file = '/views/'+ helpers.friendlyUrl(actor.name);
					mkdirp(folder + file ,function(){
						total++;
						if(total === limit){
							callback();
						}
					});
				}
			},
			function(callback){
				socket.emit('info','Generating views');
				var text = templateFile('index_view');
				var template = Handlebars.compile(text);
				var file = 'views/index/index.hbs';
				var total = 0;
				var limit = project.actors.length + 1;
				//Generating index view
				fs.writeFile(folder +file , template(project), function () {
					total++;
					if(total === limit){
						callback();
					}
				});
				
				text = templateFile('role_view');
				template = Handlebars.compile(text);
				//Generating index view for each role
				for(var i=0; i<project.actors.length; i++){
					var actor = project.actors[i];
					file = '/views/'+ helpers.friendlyUrl(actor.name) +'/index.hbs';
					fs.writeFile(folder +file , template(actor), function () {
						total++;
						if(total === limit){
							callback();
						}
					});
				}
			},
			function(callback){
				socket.emit('info','Generating partials');
				var total = 0;
				var limit = project.actors.length + 1;
				var text = templateFile('role_partial');
				var template = Handlebars.compile(text);
				var file;
				
				for(var i=0; i<project.actors.length; i++){
					var actor = project.actors[i];
					actor.useCases = project.useCaseAssociations.filter(function(association){
						return association.actor.toString() === actor._id.toString();
					}).map(function(association){
						for(var j=0; j<project.functionalRequirements.length; j++){
							var useCase = project.functionalRequirements[j];
							if(useCase._id.toString() === association.useCase.toString()	){
								return useCase;
							}
						}
					});
					file = '/views/partials/'+ helpers.friendlyUrl(actor.name) +'.hbs';
					fs.writeFile(folder +file , template(actor), function () {
						total++;
						if(total === limit){
							callback();
						}
					});
				}

				text = templateFile('header');
				template = Handlebars.compile(text);
				file = '/views/partials/header.hbs';
				fs.writeFile(folder +file , template(project), function () {
					total++;
					if(total === limit){
						callback();
					}
				});
			},
			function(callback){
				socket.emit('info','Creating settings');
				var text = templateFile('conf');
				var template = Handlebars.compile(text);
				var file = 'conf/Conf.php';
				fs.writeFile(folder +file , template(project), function () {
					callback();
				});
			}
		],function(){
			socket.emit('info','Done go to: http://localhost/preview/'+projectId);
		});		
	});	
}