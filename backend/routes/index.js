var express	= require("express"),
	app 	= require("../app/server.js");

module.exports=(function(){
	var router = express.Router();
	router.get('/', function(req, res) {
		res.render('index');
	});
	app.use('/', router);
	return router;
})();
