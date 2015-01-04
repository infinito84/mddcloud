var Backbone	=	require("backbone"),
	app			=	require("../app/namespace.js");

module.exports=Backbone.Router.extend({
	routes:{
		"":"index",
		"change/:color":"change_color"
	},
	index:function(){
		app.utils.loadHome();
	},
	change_color:function(color){
		
	}
});