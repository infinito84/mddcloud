var Backbone	=	require("backbone"),
	$			=	require("jquery");	

(function(){
	var mdd={
		model:{},
		view:{}
	}

	mdd.model.Project=require("./models/project.js");
	mdd.view.ViewProject1=require("./views/project1.js");
	mdd.view.ViewProject2=require("./views/project2.js");
	mdd.router=require("./router/router.js");
	
	window.mdd=mdd;

})();



var project=new mdd.model.Project({name:"Mi primer proyecto",theme:"blue"});
var projectView1=new mdd.view.ViewProject1({model:project});
projectView1.render();
var projectView2=new mdd.view.ViewProject2({model:project,el:$("svg")});
projectView2.render();
var route=new mdd.router();
mdd.project=project;
Backbone.history.start();
