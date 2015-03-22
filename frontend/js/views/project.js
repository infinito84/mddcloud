var Backbone			=	require("backbone"),
	$					=	require("jquery"),
	app					=	require("../app/namespace.js"),
	modal 				= 	require("../app/modal.js"),
	EnumerationsView 	=	require("./enumerations.js"),
	ParticipantsView 	=	require("./participants.js");

module.exports = Backbone.View.extend({
	tagName:"div",
	className:"project-view",
	events:{
		//"change .field input,.field textarea,.field select":"change",
		"click #view-enumerations" : "viewEnumerations",
		"click #view-participants" : "viewParticipants"
	},
	template:require("../templates/project.hbs"),
	render:function(){
		$(".menu li").removeClass("active");
		$("[href='#project']").parent().addClass("active");
		var html=this.template(this.model.toJSON())
		this.$el.html(html);
		app.utils.dataBinding(this);
		return this;
	},	
	initialize : function() {
		this.listenTo(this.model, "change", this.update,this);
	},
	update : function(){
		if(this.model.hasChanged("template")){
			this.$el.find(".field img").attr("src","img/themes/"+this.model.get("template").toLowerCase()+".png");
		}
	},
	viewParticipants : function(){
		new ParticipantsView({
			collection : app.collections.participants
		});
	},
	viewEnumerations : function(){
		new EnumerationsView({
			collection : app.collections.enumerations
		});
	}
});