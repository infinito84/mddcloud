var Backbone	=	require("backbone"),
	$			=	require("jquery"),
	Handlebars	=	require("handlebars");
	Backbone.$	=	$;

module.exports=Backbone.View.extend({
	tagName:"div",
	className:"project",
	template:Handlebars.compile($("#project-template").html()),
	render:function(){
		var el=this.$el;
		var html=this.template(this.model.toJSON())
		el.html(html);
		$("#aplication").append(el);
	},
	events:{
		"click span":"click2"
	},
	click2:function(e){
		console.log(this);
		console.log(e);
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render,this);
	}
});