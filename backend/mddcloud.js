var fs 		= require('fs'),
	async 	= require('async');

async.series({
	loadModels : function(callback){
		fs.readdir(__dirname+'/models', function (err, files) { 
			files.forEach( function (file) {
				require('./models/'+file);
			});
			callback();
		});
	},
	loadServer : function(callback){
		require("./app/server");
		fs.readdir(__dirname+'/routes', function (err, files) { 
			files.forEach( function (file) {
				require('./routes/'+file);
			});
			callback();
		});
	}
});