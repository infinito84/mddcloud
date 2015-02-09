var availableSockets	= require('./availableSockets'),
	ObjectId			= require('mongoose').Types.ObjectId,
	Project				= require('../model/project'),
	User				= require('../model/user'),
	async				= require('async');

module.exports=(function(){


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
			if(projectId === undefined){
				socket.emit('requestError',{error:'Project undefined'});
				return;
			}

			//We create groups based to projectId for broacasting.
			availableSockets.add(sessionID,socket,projectId);
			socket.on('disconnect', function () {
				availableSockets.remove(session.sessionID);
			});

			socket.on('sync',function(params,fn){
				console.log(params);
				var notifyAll = function(params){
					availableSockets.getSockets(projectId,sessionID).forEach(function(socket){
						socket.emit('sync',params);
					});
				};
				var Model = require("../model/"+params.model.toLowerCase());
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
						
			//Send to client all project data		
			Project.findById(projectId)
			.deepPopulate('participants.user,enumerations')
			.exec(function (error,project) {
				if (error){
					socket.emit('requestError',{error:'Internal error!'});
					return;
				}
				if (project) {
					socket.emit('data',project);
				}
				else{
					socket.emit('requestError',{error:'Dont\'s exits project: '+projectId+'!'});
				}
			});				
		});
		console.log('Socket.IO ready!');
	}	
})();
