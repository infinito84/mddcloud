module.exports=(function(){
	var sockets={};

	return {
		add:function(sessionID,socket,projectId){
			if(sessionID===undefined)return;
			if(socket===undefined)return;
			sockets[sessionID]={
				socket 		: socket,
				projectId 	: projectId
			}
		},
		remove:function(sessionID){
			if(sessionID===undefined)return;
			delete sockets[sessionID];
		},
		getSocket:function(sessionID){
			if(sessionID===undefined)return undefined;
			var elem = sockets[sessionID];
			if(elem===undefined)return undefined;
			return elem.socket;
		},
		getSockets:function(projectId,sessionID){
			return Object.keys(sockets).filter(function(index){
				return index!==sessionID&&sockets[index].projectId===projectId;
			}).map(function(index){
				return sockets[index].socket;
			});
		}
	}
})();