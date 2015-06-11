var generateWebApp 	= require('../app/generateWebApp'),
	projectId		= '55675b3ef5accbf033c3313d',
	async 			= require('async'),
	fs 				= require('fs'),
	socket			= {
		emit		: function(a,b){
			console.log(b);
		}
	};

async.series({
	loadModels : function(callback){
		fs.readdir(__dirname+'/../models', function (err, files) { 
			files.forEach( function (file) {
				require('../models/'+file);
			});
			callback();
		});
	},
	test : function(callback){
		generateWebApp.bind({
			projectId 	: projectId,
			socket		: socket
		})();
		callback();
	}
});
