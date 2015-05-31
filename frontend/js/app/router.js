var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),	
	ProjectView 	= require('../views/project'),
	MettingsView 	= require('../views/meetings'),
	UseCaseView  	= require('../views/useCase'),
	ClassView		= require('../views/classDiagram'),
	ActivityView	= require('../views/activityDiagram');

var removeCurrentView = function(){
	if(app.currentView){
		app.currentView.remove();
	}
}

module.exports=Backbone.Router.extend({
	routes:{
		'project' 					: 'project',
		'meetings'					: 'meetings',
		'create/:model'				: 'create',
		'view/:model/:id'			: 'view',
		'useCase'					: 'useCase',
		'classDiagram'				: 'classDiagram',
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
		else if (model === 'actor'){
			View = require('../views/actorForm');
		}
		else if (model === 'functionalRequirement' || model === 'diagramActivity'){
			View = require('../views/functionalRequirementForm');
		}
		else if (model === 'nonFunctionalRequirement'){
			View = require('../views/nonFunctionalRequirementForm');
		}
		else if (model === 'storageRequirement'){
			View = require('../views/storageRequirementForm');
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
		else if(model === 'actor'){
			View = require('../views/actor');
			collection = app.collections.actors;
		}
		else if(model === 'functionalRequirement'){
			View = require('../views/functionalRequirement');
			collection = app.collections.functionalRequirements;
		}
		else if(model === 'nonFunctionalRequirement'){
			View = require('../views/nonFunctionalRequirement');
			collection = app.collections.nonFunctionalRequirements;
		}
		else if(model === 'storageRequirement'){
			View = require('../views/storageRequirement');
			collection = app.collections.storageRequirements;
		}
		else if (model === 'activityDiagram'){
			var activityView = new ActivityView({
				model : app.collections.functionalRequirements.get(id)
			});
			app.setCurrentView(activityView);
			activityView.svg();
		}
		//Add others
		if(View !== null){
			var view = new View({
				model : collection.get(id)
			});
			app.setCurrentView(view);
		}
	},
	useCase : function(){
		var useCaseView = new UseCaseView();
		app.setCurrentView(useCaseView);
		useCaseView.svg();
	},
	classDiagram : function(){
		var classView = new ClassView();
		app.setCurrentView(classView);
		classView.svg();
	},
	activityDiagram : function(id){
		
	}
});