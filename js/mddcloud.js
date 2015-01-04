var Backbone	=	require("backbone"),	
	i18n		=	require("i18next-client"),
	$			=	require("jquery"),
	app			=	require("./app/namespace.js");
	app.utils	=	require("./utils/index.js")();
	Backbone.$	=	$;	

$(document).ready(function(){
	i18n.init({fallbackLng:"en"},function(){
		app.router=require("./router/router.js");		
		var route=new app.router();
		Backbone.history.start();
	});
});

