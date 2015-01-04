var Backbone		=	require("backbone"),
	Handlebars		=	require("handlebars"),
	i18n			=	require("i18next-client"),
	$				=	require("jquery");
	Backbone.$		=	$;
	window.jQuery	=	$;
	require("jquery_nicescroll");
	delete window.jQuery;
	

Handlebars.registerHelper('t', function(i18n_key) {
	var result = i18n.t(i18n_key);
	return new Handlebars.SafeString(result);
});

i18n.init({lng:"en",fallbackLng:"en"},function(){
	var mdd={
		model:{},
		view:{}
	}
	mdd.router=require("./router/router.js");		
	var route=new mdd.router();
	Backbone.history.start();
	window.mdd=mdd;
});

$(document).ready(function(){
	$(".sidebar").niceScroll();
	$(".dropdown").click(function(e){
		var ul=$(e.target).parent().children("ul");
		var i=$(e.target).parent().children("i");
		if(ul.css("display")==="none"){
			ul.show();
			i.removeClass("fa-chevron-circle-right");
			i.addClass("fa-chevron-circle-down");
		}
		else{
			ul.hide();
			i.removeClass("fa-chevron-circle-down");
			i.addClass("fa-chevron-circle-right");
		}
	});
	$("#app>i").click(function(){
		if($("#app>i").hasClass("fa-chevron-left")){
			$("#app").animate({
				width:"100%",
				"margin-left":"0px"
			},1000,function(){
				$("#app>i").removeClass("fa-chevron-left");
				$("#app>i").addClass("fa-chevron-right");	
			});
		}
		else{			
			$("#app").animate({
				width:"80%",
				"margin-left":"20%"
			},1000,function(){
				$("#app>i").removeClass("fa-chevron-right");
				$("#app>i").addClass("fa-chevron-left");
			});
		}
	});
	window.scrollTo(0,1);
});

window.onpopstate = function(event) {
	if(event.state!=null){
		alert(document.location);
	}
	event.preventDefault();
};	

