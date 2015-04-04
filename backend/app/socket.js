var availableSockets	= require('./availableSockets'),
	ObjectId			= require('mongoose').Types.ObjectId,
	Project				= require('../models/project'),
	async				= require('async');

module.exports=(function(){

	var deepPopulateArray = [
		'participants.user',
		'actors',
		'enumerations',
		'multimedias',
		'objectives',
		'storageRequirements.attributes',
		'functionalRequirements.diagramActivities.activities',
		'nonFunctionalRequirements'
	];

	return function(server,store){
		var	io = require('socket.io')(server);
		
		//Added session socket functionality
		io.use(require('express-session-socket.io')(store,'mddcloud', function (err, session, socket, next) {
			if (err) next(err);
			socket.session = session;
			next();
		}));			

		io.on('connection',function(socket){
			var session = socket.session||{};
			var projectId = session.project;
			var sessionID = session.sessionID;
			var user = session.user;
			if(projectId === undefined){
				socket.emit('requestError', 'Project undefined');
				return;
			}
			if(user === undefined){
				socket.emit('requestError', 'User undefined');
			}

			//We create groups based to projectId for broacasting.
			availableSockets.add(sessionID,socket,projectId);
			socket.on('disconnect', function () {
				availableSockets.remove(sessionID,projectId);
			});

			socket.on('sync',function(params,fn){
				console.log(params);
				var notifyAll = function(params){
					availableSockets.getOthers(projectId,sessionID).forEach(function(socket){
						socket.emit('sync',params);
					});
				};
				var nameModel = params.model.charAt(0).toLowerCase()+params.model.substr(1,params.model.length);
				var Model = require("../models/" + nameModel);
				if(params.method === "create"){
					Model.create(projectId,params.data,fn,notifyAll);
				}
				if(params.method === "read"){
					Model.read(params.id,fn);
				}
				if(params.method === "update"){
					notifyAll(params);
					Model.update(params.id,params.data,fn);
				}
				if(params.method === "delete"){
					notifyAll(params);
					Model.delete(projectId,params.id,fn);
				}
			});

			async.series([
				function(callback){
					//Send to client all project data		
					Project.findById(projectId)
					.deepPopulate(deepPopulateArray)
					.exec(function (error,project) {
						if (error){
							callback('Internal error');
							return;
						}
						if (project) {
							socket.emit('data',project,callback);
						}
						else{
							callback('Dont\'s exits project: '+projectId+'!');
						}
					});		
				},
				function(callback){
					socket.emit('role',user,callback);	
				}
			],
			function(error){
				if(error){
					socket.emit('requestError',error);;
				}
				else{
					socket.emit('finishData');
				}
			});
		});
		console.log('Socket.IO ready!');
	}	
})();
