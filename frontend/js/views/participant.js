var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 = 	require("../app/namespace.js");

module.exports=Backbone.View.extend({
	tagName : "tr",
	className : "participant-view",
	events : {
		"click button.btn-danger" : "disableParticipant",
		"click button.btn-primary" : "enableParticipant"
	},
	template : require("../templates/participant.hbs"),
	render : function(){
		var model = this.model.toJSON();
		model.user = app.collections.users.get(model.user).toJSON();
		var html=this.template(model);
		this.$el.html(html);
		app.utils.dataBinding(this);
		return this;
	},	
	disableParticipant : function(){
		this.model.set("status","DISABLED");
		this.model.save();
	},
	enableParticipant : function(){
		this.model.set("status","ENABLED");
		this.model.save();
	}
});