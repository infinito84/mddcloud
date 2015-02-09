var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 =	require("../app/namespace.js"),
	
	ProjectView  =	require("../views/project.js");

module.exports=Backbone.Router.extend({
	routes:{
		"project":"project"
	},
	project:function(){		
		var projectView = new ProjectView({
			model:app.project
		});
		app.currentView = projectView;
		$("#container").html(projectView.render().el);
	}
});