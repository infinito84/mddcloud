var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	modal			= require('../app/modal'),
	ObjectiveModel 	= require('../models/objective');

module.exports=  Backbone.View.extend({
	template : require('../templates/objectiveForm.hbs'),
	render : function(){
		var obj = this.model.toJSON();
		obj.multimedias = app.collections.multimedias.toJSON();
		obj.sources = app.collections.users.toJSON();
		obj.objectives = app.collections.objectives.toJSON();
		var html=this.template(obj);
		this.$el.html(html);	
		this.$el.find('select').select2();
		this.$el.find('select[data=multimedias]').select2('val',this.model.get('multimedias'));
		this.$el.find('select[data=sources]').select2('val',this.model.get('sources'));
		this.$el.find('select[data=parentObjective]').select2('val',this.model.get('parentObjective'));
		app.utils.dataBinding(this);
		return this;
	},
	initialize : function() {
		var view = this;
		modal.show({
			title 	: app.utils.t('Edit objective')
		},800,500);
		$('.modal .content').html(this.render().el);
	}
});