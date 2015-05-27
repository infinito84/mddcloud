var Backbone			=	require("backbone"),
	$					=	require("jquery"),
	app					= 	require("../app/namespace"),
	modal				=	require("../app/modal");

module.exports=  Backbone.View.extend({
	template : require("../templates/multimediaForm.hbs"),
	render : function(){
		var html=this.template(this.model.toJSON());
		this.$el.html(html);		
		return this;
	},
	initialize : function() {
		var view = this;
		modal.show({
			title : view.model.get('type'),
		},600,300);
		$(".modal .content").html(this.render().el);	
		app.utils.dataBinding(this);
	}
});