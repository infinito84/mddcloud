var express				= require('express'),
	multer 				= require('multer'),
	fs 					= require('fs'),
	ffmpeg 				= require('fluent-ffmpeg'),
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
		onFileUploadStart : function(file, req, res){
			var socket = availableSockets.getOwn(req.body.project,req.sessionID);
			socket.emit('info',req.i18n.t('Reciving data from') + ': ' + file.originalname);
		},
		onFileUploadComplete : function(file, req, res){
			var socket = availableSockets.getOwn(req.body.project,req.sessionID);
			socket.emit('info', file.size + ' ' + req.i18n.t('bytes received'));
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
			if(file.extension !== 'mp3'){
				socket.emit('info',req.i18n.t('Processing audio...'));	
				var newPath = file.path.replace('.'+file.extension,'') + '.mp3';
				ffmpeg(file.path).on('error', function(err) {
					socket.emit('requestError',req.i18n.t('Error converting the audio to MP3'));
					console.log(err.message);
					end();
				}).on('end', function() {
					fs.unlink(file.path);
					file.path = newPath;
					file.extension = 'mp3';
					socket.emit('info',req.i18n.t('Audio converted to MP3')+'!');	
					end();
				}).format('mp3').save(newPath);
			}
			else{
				end();
			}
		}
		else if(type === 'VIDEO'){
			file.description = req.i18n.t('An video resource');
			socket.emit('info',req.i18n.t('Processing video...'));	
			var newPath = file.path.replace('.'+file.extension,'')+'.mp4';
			ffmpeg(file.path).on('error', function(err) {
				socket.emit('requestError',req.i18n.t('Error processing the video'));
				console.log(err.message);
				end();
			}).on('end', function() {
				fs.unlink(file.path);
				file.path = newPath;
				file.extension = 'mp4';
				socket.emit('info',req.i18n.t('Video processed')+'!');	
				end();
			}).size('480x320').format('mp4').save(newPath);
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
