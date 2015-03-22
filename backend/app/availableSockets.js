module.exports=(function(){
	var sockets=[];

	return {
		add:function(sessionID,socket,projectId){
			if(sessionID === undefined) return;
			if(socket === undefined) return;
			if(projectId === undefined) return;
			sockets.push({
				sessionID 	: sessionID,
				socket 		: socket,
				projectId 	: projectId
			});
		},
		remove : function(sessionID,projectId){
			sockets.filter(function(elem){
				if(elem.sessionID === sessionID & elem.projectId === projectId) return false;
				else return true;
			});
		},
		getOwn : function(projectId,sessionID){
			for(var i = 0; i < sockets.length; i++){
				var socket = sockets[i];
				if (socket.sessionID === sessionID && socket.projectId === projectId){
					return socket.socket;
				}
			}
			return null;
		},
		getOthers : function(projectId,sessionID){
			return sockets.slice(0).filter(function(elem){
				return elem.sessionID !== sessionID & elem.projectId === projectId;
			}).map(function(elem){
				return elem.socket;
			});
		},
		getAll : function(projectId){
			return sockets.slice(0).filter(function(elem){
				return elem.projectId === projectId;
			}).map(function(elem){
				return elem.socket;
			});
		},
		notifyAll : function(sockets,data){
			sockets.forEach(function(socket){
				socket.emit('sync',data);
			});
		}
	}
})();