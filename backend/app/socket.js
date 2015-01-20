var ObjectId = require('mongoose').Types.ObjectId,
	Project  = require('../model/project'),
	User	 = require('../model/user'),
	async 	 = require('async');

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
			if(projectId === undefined){
				socket.emit('requestError',{error:"Project undefined"});
				return;
			}
			async.waterfall([
				function(callback2){					
					Project.findById(projectId)
					.populate('participants')
					.populate('participants.user')
					.exec(function (error,project) {
						if (error){
							callback2('Internal error!');
							return;
						}
						console.log(project);
						return;
						if (project) {
							socket.emit('data',{
								type : 'project',
								json : project
							},function(){
								callback2(null,project.participants.map(function(participant){
									return participant.userId;
								}));
							});
						}
						else{
							callback2('Dont\'s exits project: '+projectId+'!');
						}
					});
				},
				function(usersId,callback2){
					var query = User.where({ _id: {$in : usersId} });
					query.find(function (error,users) {
						if (error){
							callback2('Internal error!');
							return;
						}
						if (users) {
							socket.emit('data',{
								type : 'users',
								json : users.map(function(user){
									return {
										_id   : user._id,
										name  : user.name,
										email : user.email,
										image : user.image
									}
								})
							},function(){
								callback2(null,"ok");
							});
						}
						else{
							callback2('Error fetching users');
						}
					});
				}
			],function(error){
				if(error){
					socket.emit('requestError',{error:error});
				}
				else{
					socket.emit('finishData');
				}
			});					
		});
		console.log("Socket.IO ready!");
	}	
})();
