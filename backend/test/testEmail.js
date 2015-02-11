var express		= require("express"),
	app 		= require("../app/server.js"),
	nodemailer 	= require('nodemailer');

module.exports=(function(){
	var router = express.Router();
	router.get('/test', function(req, res) {
		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'mddcloud.org@gmail.com',
				pass: 'sergio...'
			}
		});
		transporter.sendMail({
			from 	: 'MDDCloud <mddcloud.org@gmail.com>',
			to 		: 'Sergio <infinito84@gmail.com>',
			subject : 'Notification | MDDCloud', 
			html 	: '<b>Correo de prueba</b>' 
		},
		function(error, info){
			if(error){
				res.send("Hubo un error al enviar el correo");
			}else{
				res.send("Correo enviado correctamente")
			}
			res.end();
		});
	});
	app.use('/', router);
	return router;
})();
