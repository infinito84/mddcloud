var Backbone	=	require("backbone"),	
	i18n		=	require("i18next-client"),
	$			=	require("jquery"),
	Router 		=	require("./app/router.js"),
	app			=	require("./app/namespace.js");
	app.utils	=	require("./app/utils.js")();
	Backbone.$	=	$;	

$(document).ready(function(){
	i18n.init({fallbackLng:"en"},function(){
		app.utils.loadHome();
		app.router=new Router();		
		Backbone.history.start();
	});
});

