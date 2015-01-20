var fs 		= require('fs'),
	async 	= require('async');

async.series({
	loadModels : function(callback){
		fs.readdir(__dirname+'/model', function (err, files) { 
			files.forEach( function (file) {
				require('./model/'+file);
			});
			callback();
		});
	},
	loadServer : function(callback){
		require("./app/server.js");
		require("./routes/index.js");
	}
});