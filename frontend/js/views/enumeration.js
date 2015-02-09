var Backbone	 =	require("backbone"),
	$			 =	require("jquery"),
	app			 = 	require("../app/namespace.js");

module.exports=Backbone.View.extend({
	tagName : "div",
	className : "field enumeration-view",
	events : {
		"change input" : "change",
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
		return this;
	},	
	initialize : function() {
		this.listenTo(this.model, "change", this.update,this);
	},
	change : function(e){
		this.model.set("values",e.target.value.split(","));
		this.model.save();
		this.cacheChanged=this.model.changedAttributes();
	},
	update : function(){
		var changed=this.model.changedAttributes();
		if(changed!==this.cacheChanged){
			var values = this.model.get("values");
			this.$el.find("input").val(values.join(","));
			this.$el.find("input").select2("val",values);
		}
	},
	delete : function(){
		app.collections.enumerations.remove(this.model);
		this.model.destroy();
	}
});