var express		= require('express'),
	app 		= require('../app/server'),
	utils 		= require('../app/utils'),
	User 		= require('../models/user'),
	passport 	= require('passport');

module.exports=(function(){
	var router = express.Router();

	router.get('/login', function(req, res) {
		var error = req.session.error;
		var success = req.session.success;
		delete req.session.error;
		delete req.session.success;
		res.render('login', {
			error   : error,
			success : success
		});
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('local',function(error,user,next){
			if(error || !user){
				req.session.error = req.i18n.t('Invalid user or password');
				res.redirect('/login');
			}
			else{
				req.login(user,function(){
					res.redirect('/projects');
				});
			}
		})(req, res, next);
	});

	router.get('/logout',function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
	return router;
})();
