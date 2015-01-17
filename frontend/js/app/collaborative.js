var io 				= require('socket.io-client'),
	app				= require("../app/namespace.js"),
	ProjectModel 	= require("../models/project.js");

module.exports=(function(){
	var socket;

	return {
		init:function(callback){
			socket=io('http://localhost');
			socket.on("data",function(data,fn){
				if(data.type==="project"){
					app.models.project=new ProjectModel(data.json);					
				}
				fn();
			});
			socket.on("finishData",callback);
			return socket;
		}
	}
})();