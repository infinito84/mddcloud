var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 =	require("../app/namespace.js"),
	ProjectModel =	require("../models/project.js"),
	ProjectView  =	require("../views/project.js");

module.exports=Backbone.Router.extend({
	routes:{
		"project":"project"
	},
	project:function(){
		app.models.project=new ProjectModel({
			name:"Projecto 1",
			description:"Esto es un projecto de prueba",
			creation_date:"2014 12 12",
			template:"UNITED"
		});
		app.models.project.set({name:"hola"});
		console.log(app.models.project.changedAttributes());
		app.views.project=new ProjectView({
			model:app.models.project
		});
		$("#container").html(app.views.project.render().el);
		window.app=app;
	}
});