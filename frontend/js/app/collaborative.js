var io 	= require('socket.io-client'),
	app	= require('../app/namespace.js');	

module.exports=(function(){
	var socket;

	return {
		init:function(next){
			socket=io('http://localhost');
			socket.on('data',function(data){
				app.loadData(data);
				next();
			});
			socket.on('requestError',function(error){
				alert(error.error);
			});
			socket.on('sync',function(params){
				if(params.model==="Project"){
					app.project.set(params.data);
				}
				else{
					var collection = null;
					if(params.model === "Enumeration"){
						collection = app.collections.enumerations;
					}
					if(params.method === "create"){
						collection.add(params.data);
					}
					if(params.method === "update"){
						var model = collection.get(params.id);
						model.set(params.data);
					}
					if(params.method === "delete"){
						var model = collection.get(params.id);
						collection.remove(model);
					}
				}
			});
			return socket;
		}
	}
})();