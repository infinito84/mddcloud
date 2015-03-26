var express	= require("express"),
	app 	= require("../app/server.js");

module.exports=(function(){
	var router = express.Router();
	router.get('/mddcloud/:project/', function(req, res) {
		req.session.project = req.params.project;
		req.session.sessionID = req.sessionID;
		var role = req.query.role;
		if(role === 'ADMIN'){
			req.session.user = "54bdd57ddbebd1c00bad7ab1";
		}
		else if(role === 'EDITOR'){
			req.session.user = "54d9a0584ef443845915b83c";
		}
		else {
			req.session.user = "550d186a9680fcfc2e857d6a";
		}
		res.render('mddcloud');
	});
	app.use('/', router);
	return router;
})();
