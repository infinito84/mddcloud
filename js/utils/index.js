var Handlebars	=	require("hbsfy/runtime"),
	i18n		=	require("i18next-client"),
	app			=	require("../app/namespace.js"),
	$			=	require("jquery");

module.exports=(function(){

	var publicUtils={
		init:function(){
			privateUtils.registerjQueryPlugins();
			privateUtils.registerHandlebarsHerlpers();
			return publicUtils;
		},
		loadHome:function(){
			app.views.home=require("../views/index.js");
			var view=new app.views.home();
			$("body").html(view.render().$el);
			view.bindEvents();
		}
	}

	var privateUtils={
		registerjQueryPlugins:function(){
			window.jQuery = $;
			require("jquery_nicescroll");
			delete window.jQuery;
		},
		registerHandlebarsHerlpers:function(){
			Handlebars.registerHelper('t', function(i18n_key) {
				var result = i18n.t(i18n_key);
				return new Handlebars.SafeString(result);
			});
		}
	}

	return publicUtils.init
})();