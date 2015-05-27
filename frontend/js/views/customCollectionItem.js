var Backbone	 =	require('backbone'),
	$			 =	require('jquery'),
	app			 = 	require('../app/namespace');

module.exports=Backbone.View.extend({
	initialize : function(options) {
		var that = this;
		this.extra = options.extra;
		if(this.extra.type === 'multimedia'){
			this.template = require('../templates/multimediaItem.hbs');
		}
		else if (this.extra.type === 'user'){
			this.template = require('../templates/userItem.hbs');
		}
	},
	render : function(){
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
		app.utils.dataBinding(this);
		return this;
	}
});