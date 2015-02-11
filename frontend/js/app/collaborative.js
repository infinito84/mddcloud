var io 	= require('socket.io-client'),
	app	= require('../app/namespace.js');	

module.exports=(function(){
	var socket;

	return {
		init:function(next){
			socket=io('http://localhost');
			
			socket.on('data', app.loadData);
			socket.on('role', app.loadRole);
			socket.on('finishData', next);
			socket.on('requestError', alert);

			socket.on('sync',function(params){
				if(params.model==="Project"){
					app.project.set(params.data);
				}
				else{
					var collection = (function(a){
						var plural = 's';
						if(a[a.length-1] === 'y'){
							plural = 'ies';
							a = a.substr(0,a.length-1);
						}
						var name=[a[0].toLowerCase(),a.substr(1,a.length),plural].join('');
						return app.collections[name];
					})(params.model);

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