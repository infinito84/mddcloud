var Handlebars	=	require("hbsfy/runtime"),
	i18n		=	require("i18next-client"),
	app			=	require("../app/namespace.js"),
	$			=	require("jquery");

module.exports=(function(){

	var publicUtils={
		init : function(){
			privateUtils.registerjQueryPlugins();
			privateUtils.registerHandlebarsHerlpers();
			return publicUtils;
		},
		loadHome : function(){
			var ViewHome=require("../views/index.js");
			var view=new ViewHome();
			$("body").html(view.render().$el);
			view.bindEvents();
		},
		t : function(i18n_key){
			var result = i18n.t(i18n_key);
			if(result===""||result===null||result===undefined)return i18n_key;
			return result;
		}
	}

	var privateUtils={
		registerjQueryPlugins:function(){
			window.jQuery = window.$ = $;
			require("jquery_nicescroll");
			require("jquery_fileupload");
			require("select2");
			delete window.jQuery;
			delete window.$;
		},
		registerHandlebarsHerlpers:function(){
			Handlebars.registerHelper('t', function(i18n_key) {
				var result = i18n.t(i18n_key);
				if(result===""||result===null||result===undefined)return i18n_key;
				return new Handlebars.SafeString(result);
			});

			Handlebars.registerHelper('lower', function(word) {
				return new Handlebars.SafeString(word.toLowerCase());
			});

			Handlebars.registerHelper('selected', function(attr,value) {
				var answer="";
				if(attr===value){
					answer="selected"
				}
				return new Handlebars.SafeString(answer);
			});

			Handlebars.registerHelper('date', function(date) {
				var d=new Date(date);
				return [d.getDate(),d.getMonth()+1,d.getFullYear()].map(function(num){
					if(num<10)return "0"+num;
					return num;
				}).join("/");
			});

			Handlebars.registerHelper('join', function(array,separator) {
				if(array instanceof Array){
					return new Handlebars.SafeString(array.join(separator));
				}
				return "";
			});
		}
	}

	return publicUtils.init
})();