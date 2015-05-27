var Backbone		=	require('backbone'),
	$				=	require('jquery'),
	app				= 	require('../app/namespace'),
	modal			=	require('../app/modal'),
	AttributeModel 	=	require('../models/attribute') ;

module.exports=  Backbone.View.extend({
	events : {
		'click button.add-attribute' : 'clickButton'	
	},
	template : require('../templates/attributeForm.hbs'),
	render : function(){
		var html=this.template({
			enumerations : app.collections.enumerations.toJSON()
		});
		this.$el.html(html);
		return this;
	},
	initialize : function() {
		var view = this;
		modal.show({
			title : app.utils.t('New attribute'),
		},400,300,function(){
			view.remove();
			modal.close();
		});
		$('.modal .content').html(this.render().$el);
	},
	clickButton : function(){
		var that = this;
		var name = this.$el.find('input.attribute-name').val().trim();
		if(name){
			this.$el.find('button.add-attribute').remove();
			var type = this.$el.find('select.attribute-type').val();
			var enumeration = this.$el.find('.attribute-type :selected').attr('data-id');
			var attribute = new AttributeModel();
			attribute.save({
				name 		: name,
				type 		: type,
				enumeration : enumeration
			},{
				successfully : function(attribute){
					app.collections.attributes.add(attribute);
					var attributes = that.model.get('attributes').slice(0);
					attributes.push(attribute.id);
					that.model.set('attributes',attributes);
					that.model.save();
					that.remove();
					modal.close();
				}
			});
		}
		else{
			alert(app.utils.t('You must write a name'));
		}
	}
});