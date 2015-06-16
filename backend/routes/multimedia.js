var express				= require('express'),
	multer 				= require('multer'),
	fs 					= require('fs'),
	app 				= require('../app/server'),
	availableSockets 	= require('../app/availableSockets'),
	Multimedia 			= require('../models/multimedia');

module.exports=(function(){
	var router = express.Router();

	router.post('/upload/', multer({
		dest 	: app.config.folder + 'frontend/public/uploads/multimedia/',
		limits 	: {
			fileSize : app.config.maxUploadFileSize
		},
		onFileSizeLimit: function (file) {
			file.failSize = true;
			fs.unlink(file.path);
		}
	}),function(req, res) {
		var project = req.body.project;
		var type = req.body.type;
		var file = req.files.multimedia;
		var socket = availableSockets.getOwn(project,req.sessionID);
		var sockets = availableSockets.getAll(project);
		res.send('Ok');
		if(file.failSize){
			file.failSize = false; //seems save cache
			socket.emit('requestError',file.originalname +' '+ req.i18n.t('exceeds the max file size') + ': '+app.config.maxUploadFileSize+' '+req.i18n.t('bytes'));
			return;
		}
		socket.emit('info', file.size + ' ' + req.i18n.t('bytes received'));
		var end = function(){
			var url = file.path.replace(app.config.folder+'frontend/public','');
			Multimedia.create(project,{
				name 		: file.name,
				description : file.description,
				type 		: type,
				url 		: url
			},function(params){
				availableSockets.notifyAll(sockets,params);
			});
		};

		file.name = file.originalname.replace('.'+file.extension,'');
		
		if(type === 'AUDIO'){
			file.description = req.i18n.t('An audio resource');
			end();
		}
		else if(type === 'VIDEO'){
			file.description = req.i18n.t('An video resource');
			end();
		}
		else if(type === 'IMAGE'){
			file.description = req.i18n.t('An image resource');
			end();
		}
		else{
			file.description = req.i18n.t('Another resource');
			end();
		}
	});

	app.use('/multimedia', router);
	return router;
})();
