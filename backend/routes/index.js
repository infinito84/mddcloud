var express		= require('express'),
	app 		= require('../app/server'),
	Project 	= require('../models/project');

module.exports=(function(){
	var router = express.Router();

	router.get('/', function(req, res) {
		Project.count({},function(error,count){
			res.render('index',{count : count});
		});		
	});

	app.use('/', router);
	return router;
})();
