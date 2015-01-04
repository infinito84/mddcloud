var Handlebars	=	require("handlebars"),
	i18n		=	require("i18next-client");

module.exports=(function(){

	var utils={
		init:function($){
			utils.registerjQueryPlugins($);
			utils.registerHandlebarsHerlpers();
			return {
				//Reveal functions
			}
		},
		registerjQueryPlugins:function($){
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

	return utils.init
})();