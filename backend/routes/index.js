var express	= require("express"),
	app 	= require("../app/server.js");

module.exports=(function(){
	var router = express.Router();
	router.get('/', function(req, res) {
		req.session.project = "54bdd57ddbebd1c00bad7ab3";
		req.session.sessionID = req.sessionID;
		req.session.user = "54bdd57ddbebd1c00bad7ab1";
		res.render('index');
	});
	app.use('/', router);
	return router;
})();
