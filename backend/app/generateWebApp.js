var Handlebars 	= require('handlebars'),
	Project		= require('../models/project'),
	helpers 	= require('../app/helpersHandlebars'),
	config		= require('./config'),
	mkdirp		= require('mkdirp'),
	async		= require('async'),	
	exec		= require('exec'),
	fs 			= require('fs');

var deepPopulateArray = [
	'enumerations',
	'participants.user',
	'actors',
	'multimedias',
	'objectives',
	'storageRequirements.attributes.enumeration',
	'functionalRequirements.actions.storageRequirement.attributes.enumeration',
	'functionalRequirements.actions.parentAction',
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
	socket.emit('info2','Starting...');
	Project.findById(projectId)
	.deepPopulate(deepPopulateArray)
	.exec(function (error,project) {
		if (error){
			callback('Internal error');
			return;
		}
		socket.emit('info2','Making the logic...');

		var folders = [];
		var files = [];
		var folder = config.folderApps + projectId +'/';

		project.mysql = {
			user : config.mysql.user,
			pass : config.mysql.password
		};

		//Generating steps from activiy diagrams
		for(var i=0; i<project.functionalRequirements.length; i++){
			var requirement = project.functionalRequirements[i];
			var steps = {};
			//Generating steps
			for(var j=0; j < requirement.actions.length; j++){
				var action = requirement.actions[j];
				if(['START', 'END'].indexOf(action.operation) !== -1){
					continue;
				}
				if(action.operation === 'READ'){
					steps[action._id] = {
						READ 	: [action],
						CREATE 	: [],
						UPDATE 	: [],
						DELETE 	: [],
						storage : action.storageRequirement
					};
				}
				else {
					steps[action.parentAction._id][action.operation].push(action);
				}
			}
			//Reducing steps
			var stepsKeys = Object.keys(steps);
			for(var j = 0; j<stepsKeys.length; j++){
				var step = steps[stepsKeys[j]];
				var total = step.CREATE.length + step.UPDATE.length + step.DELETE.length;
				if(total === 0){
					if(j < stepsKeys.length -1){
						var nextStep = steps[stepsKeys[j + 1]]; //Must be replaced in future :)
						nextStep.READ = step.READ.concat(nextStep.READ);
						nextStep.storageInit = step.storageInit || step.storage;
						delete steps[stepsKeys[j]];
					}
				}
				else{
					step.needArray = true;
				}
			}

			//Defining model functions for storage requirements
			//And previous and next storage requirements for step
			stepsKeys = Object.keys(steps);
			for(var j = 0; j<stepsKeys.length; j++){
				var step = steps[stepsKeys[j]];
				step.requirementName = requirement.name;
				if(j === 0){
					requirement.firstStep = step;
				}
				if(j > 0){
					step.previousStorage = steps[stepsKeys[j-1]].storage;
				}
				if(j < stepsKeys.length -1){
					step.nextStorage = steps[stepsKeys[j+1]].storage;
				}
				step.relationships = project.classAssociations.filter(function(association){
					return association.classB._id.toString() === step.storage._id.toString();
				}).map(function(association){
					for(var j=0; j<project.storageRequirements.length; j++){
						var storage = project.storageRequirements[j];
						if(storage._id.toString() === association.classA._id.toString()){
							return storage;
						}
					}
				});
				if(step.storageInit){
					var storage = (function(storage){
						for(var k = 0; k<project.storageRequirements.length; k++){
							if(storage._id.toString() === project.storageRequirements[k]._id.toString()){
								return project.storageRequirements[k];
							}
						}
					})(step.storageInit);
					
					storage.functions = storage.functions || {};
					var method = helpers.className(step.storage.name);
					storage.functions[method] = helpers.getSQL(step.READ);
				}
			}
			requirement.steps = steps;
		}

		//Adding functions for the models
		for(var k = 0; k<project.storageRequirements.length; k++){
			var storage = project.storageRequirements[k];
			if(storage.functions){
				var functions = [];
				for(var name in storage.functions){
					functions.push({
						name 	: name,
						sql 	: storage.functions[name].sql,
						where 	: storage.functions[name].where
					});
				}
				storage.functions = functions;
			}
		}

		//Generating database.sql
		var text = templateFile('sql');
		var template = Handlebars.compile(text);
		files.push({
			file : folder + 'database.sql',
			data : template(project)
		});

		//Generating models
		text = templateFile('model');
		template = Handlebars.compile(text);
		for(var i=0; i<project.storageRequirements.length; i++){
			var storage = project.storageRequirements[i];
			files.push({
				file : folder + 'models/' + helpers.className(storage.name) +'.php',
				data : template(storage)
			});
		}

		//Generating a controller for each functional requirement
		text = templateFile('controller');
		template = Handlebars.compile(text);
		for(var i=0; i<project.functionalRequirements.length; i++){
			var requirement = project.functionalRequirements[i];
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
			files.push({
				file : folder + 'controllers/'+ helpers.className(requirement.name) +'Controller.php',
				data : template(requirement)
			});
		}

		//Generating a controller for each role
		text = templateFile('role_controller');
		template = Handlebars.compile(text);
		for(var i=0; i<project.actors.length; i++){
			var actor = project.actors[i];
			file = 'controllers/'+ helpers.className(actor.name) +'Controller.php';
			actor.roles = [helpers.roleName(actor.name)];
			files.push({
				file : folder + 'controllers/'+ helpers.className(actor.name) +'Controller.php',
				data : template(actor)
			});
		}

		//Generating Index Controller
		text = templateFile('index_controller');
		template = Handlebars.compile(text);
		files.push({
			file : folder + 'controllers/IndexController.php',
			data : template(project)
		});

		//Generating index view
		text = templateFile('index_view');
		template = Handlebars.compile(text);
		files.push({
			file : folder + 'views/index/index.hbs',
			data : template(project)
		});	
		
		//Generating index view for each role
		text = templateFile('role_view');
		template = Handlebars.compile(text);		
		for(var i=0; i<project.actors.length; i++){
			var actor = project.actors[i];
			files.push({
				file : folder + 'views/'+ helpers.friendlyUrl(actor.name) +'/index.hbs',
				data : template(actor)
			});
		}

		//Generating views for each step on activities diagram
		text = templateFile('view');
		template = Handlebars.compile(text);
		for (var i = 0; i < project.functionalRequirements.length; i++) {
			var requirement = project.functionalRequirements[i];
			var stepsKeys = Object.keys(requirement.steps);
			for (var j = 0; j < stepsKeys.length; j++) {
				var step = requirement.steps[stepsKeys[j]];
				var folder2 = helpers.friendlyUrl(requirement.name);
				var fileName = helpers.friendlyUrl(step.storage.name);
				files.push({
					file : folder + 'views/'+ folder2 +'/'+ fileName +'.hbs',
					data : template(step)
				});
			};
		};

		//Generating partial for each role
		text = templateFile('role_partial');
		template = Handlebars.compile(text);
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
			files.push({
				file : folder + 'views/partials/'+ helpers.friendlyUrl(actor.name) +'.hbs',
				data : template(actor)
			});
		}

		//Generating header partial
		text = templateFile('header');
		template = Handlebars.compile(text);
		files.push({
			file : folder + 'views/partials/header.hbs',
			data : template(project)
		});

		//Generating documentation
		helpers.root = project;
		text = templateFile('documentation');
		template = Handlebars.compile(text);
		files.push({
			file : folder + 'documentation.html',
			data : template(project)
		});

		//Generating view folder for IndexController
		folders.push(folder + 'views/index/');

		//Generating view folders for each functional controller
		for(var i=0; i<project.functionalRequirements.length; i++){
			var requirement = project.functionalRequirements[i];
			folders.push(folder + 'views/'+ helpers.friendlyUrl(requirement.name));
		}

		//Generating view folders for each role controller
		for(var i=0; i<project.actors.length; i++){
			var actor = project.actors[i];
			folders.push(folder + 'views/'+ helpers.friendlyUrl(actor.name));
		}

		async.series([
			function(callback){
				exec('rm -rf '+ folder,function(){
					callback();
				});
			},
			function(callback){
				mkdirp(folder,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info2','Copying framework');
				exec('cp -rf '+ config.framework +'* '+ folder,function(){
					var template = config.folderApps +'bootswatch/'+project.template.toLowerCase()+'/bootstrap.min.css '
					exec('cp -rf '+ template + folder + 'public/css/',function(){
						callback();
					});
				});
			},
			function(callback){
				exec('chmod -R 777 '+ folder,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info2','Making folders');
				var total = 0;
				var limit = folders.length;
				for (var i = 0; i < folders.length; i++) {
					mkdirp(folders[i],function(){
						total++;
						if(total === limit){
							callback();
						}
					});
				};				
			},
			function(callback){
				socket.emit('info2','Writing files');
				var total = 0;
				var limit = files.length;
				for (var i = 0; i < files.length; i++) {
					fs.writeFile(files[i].file , files[i].data, function () {
						total++;
						if(total === limit){
							callback();
						}
					});
				};				
			},
			function(callback){
				socket.emit('info2', 'Making a zip project file');
				exec('cd '+ config.folderApps +' && zip -rp '+ config.folderApps + projectId +'/download.zip '+ projectId,function(){
					callback();
				});
			},
			function(callback){
				socket.emit('info2','Creating settings');
				text = templateFile('conf');
				template = Handlebars.compile(text);
				file = 'conf/Conf.php';
				fs.writeFile(folder +file , template(project), function () {
					callback();
				});
			},
			function(callback){
				socket.emit('info2','Creating database');
				var user = config.mysql.user;
				var pass = config.mysql.password;
				exec('mysql -u'+ user +' -p'+ pass +' < '+ folder +'database.sql',function(){
					callback();
				});
			}
		],function(){
			socket.emit('finish2',config.host+'preview/'+projectId);
		});		
	});	
}