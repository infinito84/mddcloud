var Backbone			=	require("backbone"),
	$					=	require("jquery"),
	app					= 	require("../app/namespace"),
	modal				=	require("../app/modal"),
	EnumerationView  	=	require("./enumeration.js"),
	EnumerationModel 	=	require("../models/enumeration.js") ;

module.exports=  Backbone.View.extend({
	events : {
		"click button.add-enumeration" : "clickButton"	
	},
	template : require("../templates/enumerationForm.hbs"),
	render : function(){
		var html=this.template({});
		this.$el.html(html);
		return this;
	},
	SubView : EnumerationView,	
	initialize : function() {
		var view = this;
		modal.show({
			title : app.utils.t("Enumerations"),
		},800,600,function(){
			view.removeViews();
			modal.close();
		});
		$(".modal .content").html(this.render().$el);	
		app.utils.listeningCollection(this);
	},
	clickButton : function(){
		var name = this.$el.find("input.add-enumeration").val();
		if(name){
			this.$el.find("input.add-enumeration").val("");
			var enumeration = new EnumerationModel({
				name   : name,
				values : []
			});
			enumeration.save();
			this.collection.add(enumeration);
		}
		else{
			alert(app.utils.t("You must write a name"));
		}
	}
});