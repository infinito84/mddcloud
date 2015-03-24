var Backbone	 = require('backbone'),
	$			 = require('jquery'),
	app			 = require('../app/namespace'),	
	ProjectView  = require('../views/project'),
	MettingsView = require('../views/meetings');

var removeCurrentView = function(){
	if(app.currentView){
		app.currentView.remove();
	}
}

module.exports=Backbone.Router.extend({
	routes:{
		'project' : 'project',
		'meetings': 'meetings',
	},
	project:function(){		
		var projectView = new ProjectView({
			model : app.project
		});
		app.setCurrentView(projectView);	
	},
	meetings : function(){
		var mettingsView = new MettingsView({
			collection : app.collections.multimedias
		});
		app.setCurrentView(mettingsView);
	}
});