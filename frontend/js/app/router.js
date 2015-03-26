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
		'project' 			: 'project',
		'meetings'			: 'meetings',
		'create/:model'		: 'create',
		'view/:model/:id'	: 'view'
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
	},
	create : function(model){
		var role = app.role.get('role');
		if(role === 'READER'){
			$.notify(app.utils.t('You don\'t have privileges to create')+'!','error');
			return;
		}
		var View = null;
		if(model === 'objective'){
			View = require('../views/objectiveForm');
		}
		//Add others
		if(View !== null){
			new View();
		}
	},
	view : function(model,id){
		var View = null;
		var collection = null;
		if(model === 'objective'){
			View = require('../views/objective');
			collection = app.collections.objectives;
		}
		//Add others
		if(View !== null){
			var view = new View({
				model : collection.get(id)
			});
			app.setCurrentView(view);
		}
	}
});