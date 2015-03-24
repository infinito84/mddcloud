var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	MultimediaForm	= require('./multimediaForm');

module.exports=Backbone.View.extend({
	tagName : 'div',
	className : 'multimedia-view',
	events : {
		'click button.edit-multimedia' : 'edit'
	},
	template : require('../templates/multimedia.hbs'),
	render : function(){
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		app.utils.dataBinding(this);
		return this;
	},
	edit : function(){
		new MultimediaForm({
			model : this.model
		});
	}
});