var Backbone	=	require("backbone"),
	$			=	require("jquery"),
	Handlebars	=	require("handlebars");
	Backbone.$	=	$;

module.exports=Backbone.View.extend({
	template:Handlebars.compile($("#project-svg").html()),
	render:function(){
		var el=this.$el;
		var html=this.template(this.model.toJSON())
		el.html(html);
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	}
});