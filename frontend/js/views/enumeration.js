var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 = 	require("../app/namespace.js");

module.exports=Backbone.View.extend({
	tagName : "div",
	className : "field enumeration-view",
	events : {
		"click button.delete-enumeration" : "delete"
	},
	template : require("../templates/enumeration.hbs"),
	render : function(){
		var html=this.template(this.model.toJSON());
		this.$el.html(html);
		this.$el.find("input").select2({
			tags 			: true,
			tokenSeparators	: [','],
		});
		app.utils.dataBinding(this);
		return this;
	},	
	delete : function(){
		app.collections.enumerations.remove(this.model);
		this.model.destroy();
	}
});