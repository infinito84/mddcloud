var Backbone	 =	require('backbone'),
	$			 =	require('jquery'),
	app			 = 	require('../app/namespace');

module.exports=Backbone.View.extend({
	tagName : 'div',
	className : 'field enumeration-view',
	events : {
		'click button.delete-enumeration' : 'delete'
	},
	template : require('../templates/enumeration.hbs'),
	render : function(){
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		this.$el.find('input').select2({
			tags 			: true,
			tokenSeparators	: [','],
			minimumResultsForSearch : Infinity
		});
		//Hack for hide the search box on tags
		this.$el.find('input')
			.select2('container')
			.find('.select2-display-none')
			.addClass('select2-hidden');
			
		app.utils.dataBinding(this);
		return this;
	},	
	delete : function(){
		app.collections.enumerations.remove(this.model);
		this.model.destroy();
	}
});