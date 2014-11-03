var Backbone	=	require("backbone"),
	$			=	require("jquery"),
	Handlebars	=	require("handlebars");

module.exports=Backbone.View.extend({
	tagName:"div",
	className:"project",
	events:{
		"click a":"myclick"
	},
	template:Handlebars.compile($("#project-template").html()),
	render:function(){
		var html=this.template(this.model.toJSON())
		this.$el.html(html);
		console.log(this.$el);
		console.log(this.el);
		return this;
	},	
	myclick:function(){
		alert("Si muestra esto funciona");
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render,this);
	}
});