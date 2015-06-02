var Backbone	= require('backbone');

module.exports = Backbone.Model.extend({
	model 		: 'Action',
	idAttribute : '_id',
	remove : function(){
		var that = this;
		var app	= require('../app/namespace');
		
		app.collections.actions.where({
			parentAction : this.id
		}).forEach(function(action){
			action.remove();
		});
		
		app.collections.actions.remove(this);
		
		app.collections.functionalRequirements.forEach(function(functionalRequirement){
			var actions = (functionalRequirement.get('actions') || []).slice(0);
			var index = actions.indexOf(that.id);
			if(index > -1){
				actions.splice(index, 1);
				functionalRequirement.set('actions', actions);
				functionalRequirement.save();
			}
		});
		this.destroy();
	}
});