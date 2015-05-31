var express		= require('express'),
	app 		= require('../app/server.js'),
	Participant = require('../models/participant');

module.exports=(function(){
	var router = express.Router();
	router.get('/mddcloud/:project/', app.isAuthenticated, function(req, res) {
		req.session.project = req.params.project;
		req.session.sessionID = req.sessionID;
		req.session.user = req.user._id;
		Participant.findOne({
			project : req.session.project,
			user 	: req.session.user
		},function(error,participant){
			if(participant){
				res.render('mddcloud', {layout : false});
			}
			else{
				req.session.error = req.i18n.utils.t('Has ocurred an error');
				res.redirect('/projects');
			}
		});		
	});
	app.use('/', router);
	return router;
})();
