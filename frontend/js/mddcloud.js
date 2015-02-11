var Backbone	=	require('backbone'),	
	i18n		=	require('i18next-client'),
	$			=	require('jquery'),
	io			=	require('./app/collaborative'),
	async		=	require('async'),
	Router 		=	require('./app/router'),
	app			=	require('./app/namespace');
	app.utils	=	require('./app/utils')();
	Backbone.$	=	$;	

$(document).ready(function(){
	var socket;

	async.parallel({
		i18n: function(callback){
			i18n.init({
				fallbackLng:'en',
				resGetPath: 'js/locales/__lng__/__ns__.json'
			},function(){
				callback(null,'ok');
			});
		},
		socket: function(callback){
			socket=io.init(function(){
				callback(null,'ok');
			});
		}
	},
	function(err, results) {
		app.utils.loadHome();
		app.router=new Router();		
		Backbone.history.start();
		Backbone.sync = function(method, model, options) {
			var data={
				method : method,
				model  : model.model,
				id 	   : model.id
			};
			if(method==='update'){
				data.data = model.changedAttributes();
				if(data.data===false)return;
			}
			if(method==='create'){
				data.data = model.toJSON();
			}
			socket.emit('sync',data,function(id){
				if(method==='create'){
					model.set('_id',id);
				}
			});
		};
	});
	
});

