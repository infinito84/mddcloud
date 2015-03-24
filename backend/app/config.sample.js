//Rename this file to config.js

module.exports = {
	host 	: 'http://localhost/',
	folder 	: '/path_mddcloud/',
	nodemailer : {
		name 	: 'Your name <example@gmail.com>',
		service	: 'Gmail',
		auth	: {
			user: 'example@gmail.com',
			pass: '******'
	    }
	},
	mongodb : 'mongodb://localhost/mddcloud'
	maxUploadFileSize : 20 * 1024 * 1024 //20MB
}