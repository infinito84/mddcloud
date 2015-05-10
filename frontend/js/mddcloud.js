var Backbone	= require('backbone'),	
	i18n		= require('i18next-client'),
	$			= require('jquery'),
	io			= require('./app/collaborative'),
	async		= require('async'),
	Router 		= require('./app/router'),
	app			= require('./app/namespace');
	app.utils	= require('./app/utils')();
	Backbone.$	= app.$ = $;


$(document).ready(function(){
	var socket;

	async.parallel({
		i18n: function(callback){
			i18n.init({
				fallbackLng:'en',
				resGetPath: '/js/locales/__lng__/__ns__.json'
			},function(){
				callback(null);
			});
		},
		socket: function(callback){
			socket=io.init(function(){
				callback(null);
			});
		}
	},
	function() {
		app.utils.loadHome();
		app.router=new Router();		
		Backbone.history.start();
	});
	
});

