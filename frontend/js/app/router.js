var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 =	require("../app/namespace.js"),
	
	ProjectView  =	require("../views/project.js");

module.exports=Backbone.Router.extend({
	routes:{
		"project":"project"
	},
	project:function(){		
		app.views.project=new ProjectView({
			model:app.models.project
		});
		$("#container").html(app.views.project.render().el);
		window.app=app;
	}
});