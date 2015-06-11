var utils 			= require('./utils'),
	passport 		= require('passport'),
	UserModel 		= require('../models/user'),
	LocalStrategy 	= require('passport-local').Strategy;

module.exports = function(app){
	//We initializing passport
	app.use(passport.initialize());
	app.use(passport.session());

	//Serialize and Deserialize User functions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		UserModel.findById(id, function(err, user) {
			done(err, user);
		});
	});

	//Defining strategy for login
	passport.use(new LocalStrategy(function(username,password,next){
		UserModel.findOne({
			email 		: username,
			password 	: utils.md5(password)
		},next);
	}));

	//Defining strategy for signup
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			findOrCreateUser = function(){
				if(req.body.password !== req.body.password2){
					req.session.error = req.i18n.t('The passwords don\'t match');
					return done(null, false);
				}
				UserModel.findOne({email : username},function(error, user) {
					if (user) {
						if(user.isActive){
							req.session.error = req.i18n.t('User already exists');
							return done(null, false);
						}
						user.password = utils.md5(password);
						user.name = req.body.name;
						user.image = 'http://www.gravatar.com/avatar/'+ utils.md5(username.trim()) +'?d=mm';
						user.sessionToken = utils.md5(''+Date.now());
						user.save(done);
					} 
					else {
						user = {
							email 			: username,
							password 		: utils.md5(password),
							name 			: req.body.name,
							image 			: 'http://www.gravatar.com/avatar/'+ utils.md5(username.trim()) +'?d=mm',
							sessionToken	: utils.md5(''+Date.now())
						}
						req.session.success = req.i18n.t('A confirmation e-mail was sended, please confirm your account');
						new UserModel(user).save(done);
					}
					//We send the confirmation e-mail
					app.nodemailer.sendMail({
						from	: 'MDDCloud <mddcloud.org',
						to		: [user.name,'<',username,'>'].join(''),
						subject	: req.i18n.t('Confirm your e-mail'),
						template: 'confirmEmail',
						context	: {
							name 	: user.name,
							link 	: app.config.url + 'confirm/'+user.sessionToken,
							layout 	: false
						}
					});
				});
			};
			process.nextTick(findOrCreateUser);
		})
	);

	//Function for protecting routers
	app.isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) {
			if(req.user.isActive){
				return next();
			}
			else{
				req.session.error = req.i18n.t('Please confirm your email');
			}
		}
		else{
			req.session.error = req.i18n.t('Please login');
		}
		res.redirect('/login');
	}
}