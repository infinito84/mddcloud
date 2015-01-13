

module.exports=(function(){
	return function(server){
		var	io = require('socket.io')(server);

		io.on("connection",function(socket){
			socket.emit("data",{
				type:"project",
				json:{
					name:"Projecto 1",
					description:"Esto es un projecto de prueba xlkjd",
					creation_date:"2014 12 12",
					template:"UNITED"
				}
			});
			socket.emit("finishData");
		});

	}	
})();
