var express	= require("express"),
	app 	= require("../app/server.js");

module.exports=(function(){
	var router = express.Router();
	router.get('/', function(req, res) {
		req.session.project="54bc164f5583a3d42aaafb84";
		res.render('index');
	});
	app.use('/', router);
	return router;
})();
