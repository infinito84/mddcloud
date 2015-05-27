var Backbone				= require('backbone'),
	$						= require('jquery'),
	app						= require('../app/namespace'),
	modal					= require('../app/modal'),
	StorageRequirementModel = require('../models/storageRequirement');

module.exports = Backbone.View.extend({
	template : require('../templates/storageRequirementForm.hbs'),
	render : function(){
		var html=this.template({
			multimedias : app.collections.multimedias.toJSON(),
			sources		: app.collections.users.toJSON()
		});
		this.$el.html(html);	
		this.$el.find("select").select2();
		return this;
	},
	initialize : function() {
		var view = this;
		modal.show({
			title 	: app.utils.t('New storage requirement'),
			buttons : [
				{class : 'btn btn-default close', text : app.utils.t('Cancel')},
				{class : 'btn btn-success create', text : app.utils.t('Create')}
			]
		},800,500);
		$('.modal .content').html(this.render().el);
		$('.modal button.create').click(function(){
			view.create();
		});
	},
	create : function(){
		var name = this.$el.find("[data=name]").val();
		var description = this.$el.find("[data=description]").val();
		var multimedias = this.$el.find("[data=multimedias]").val();
		var sources = this.$el.find("[data=sources]").val();
		if(name === ''){
			$.notify(app.utils.t('You must write a name')+'!','error');
			return;
		}
		var storageRequirement = new StorageRequirementModel();
		storageRequirement.save({
			name 			: name,
			description 	: description,
			multimedias		: multimedias || [],
			authors 		: [app.role.get('user')],
			sources			: sources || []
		},{
			successfully : function(storageRequirement){
				app.collections.storageRequirements.add(storageRequirement);
			}
		});
		modal.close();
		this.remove();
	}
});