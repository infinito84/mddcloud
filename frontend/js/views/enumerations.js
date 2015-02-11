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
		var html=this.template(this.model);
		this.$el.html(html);
		return this;
	},
	attachedViews : [],	
	initialize : function() {
		modal.show({
			title : app.utils.t("Enumerations"),
		},800,600,this.removeViews,this);
		$(".modal .content").html(this.render().$el);
		var view = this;
		this.collection.forEach(function(enumeration){
			view.addedEnumeration(enumeration);
		});
		this.collection.bind("add",this.addedEnumeration,this);
		this.collection.bind("remove",this.removedEnumeration,this);
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view,i){
			view.remove();
		});
		this.remove();
		modal.close();
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
	},
	addedEnumeration : function(enumeration){
		var $enumerations = this.$el.find(".enumerations");
		var view = new EnumerationView({
			model : enumeration
		});
		$enumerations.append(view.render().$el);
		this.attachedViews.push(view);
	},
	removedEnumeration : function(enumeration){
		this.attachedViews.filter(function(view){
			if(view.model === enumeration){
				view.remove();
				return false;
			}
			return true;
		});
	}
});