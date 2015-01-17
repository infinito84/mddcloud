var Backbone	=	require("backbone"),	
	i18n		=	require("i18next-client"),
	$			=	require("jquery"),
	io			=	require("./app/collaborative.js"),
	async		=	require("async"),
	Router 		=	require("./app/router.js"),
	app			=	require("./app/namespace.js");
	app.utils	=	require("./app/utils.js")();
	Backbone.$	=	$;	

$(document).ready(function(){
	async.parallel({
		i18n: function(callback){
			i18n.init({
				fallbackLng:"en",
				resGetPath: 'js/locales/__lng__/__ns__.json'
			},function(){
				callback(null,"ok");
			});
		},
		socket: function(callback){
			io.init(function(){
				callback(null,"ok");
			});
		}
	},
	function(err, results) {
		app.utils.loadHome();
		app.router=new Router();		
		Backbone.history.start();
	});
	
});

