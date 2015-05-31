var express		= require('express'),
	passport 	= require('passport'),
	app 		= require('../app/server'),
	UserModel 	= require('../models/user');

module.exports=(function(){
	var router = express.Router();

	router.get('/register', function(req, res) {
		var error = req.session.error;
		var success = req.session.success;
		delete req.session.error;
		delete req.session.success;
		res.render('register',{
			error 	: error,
			success : success
		});
	});

	router.post('/register', passport.authenticate('signup', {
		successRedirect: '/register',
		failureRedirect: '/register',
		failureFlash : true 
	}));

	router.get('/confirm/:sessionToken', function(req, res){
		UserModel.findOne({
			sessionToken : req.params.sessionToken
		},function(error,user){
			if(user){
				user.isActive = true;
				user.save(function(){
					req.session.success = req.i18n.t('Your account has been validated');
					res.redirect('/login');	
				});
			}
			else{
				req.session.error = req.i18n.t('Invalid token');
				res.redirect('/login');
			}
		});
	});

	app.use('/', router);
	return router;
})();
