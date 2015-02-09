var Backbone			=	require("backbone"),
	$					=	require("jquery"),
	app					=	require("../app/namespace.js"),
	modal 				= 	require("../app/modal.js"),
	EnumerationsView 	=	require("./enumerations.js");

module.exports = Backbone.View.extend({
	tagName:"div",
	className:"project-view",
	events:{
		"change .field input,.field textarea,.field select":"change",
		"click #view-enumerations" : "viewEnumerations",
		"click #view-participants" : "viewParticipants"
	},
	template:require("../templates/project.hbs"),
	render:function(){
		$(".menu li").removeClass("active");
		$("a[href='#project']").parent().addClass("active");
		var html=this.template(this.model.toJSON())
		this.$el.html(html);
		return this;
	},	
	initialize : function() {
		this.listenTo(this.model, "change", this.update,this);
	},
	change : function(e){
		var $t=$(e.target);
		var data=$t.attr("data");
		this.model.set(data,$t.val());
		this.model.save();
		this.cacheChanged=this.model.changedAttributes();
	},
	update : function(){
		var changed=this.model.changedAttributes();
		if(changed!==this.cacheChanged){
			var array=Object.keys(changed);
			for(var i=0;i<array.length;i++){
				var attr=array[i];
				this.$el.find(".field input[data="+attr+"]").val(changed[attr]);
				this.$el.find(".field textarea[data="+attr+"]").val(changed[attr]);
				this.$el.find(".field select[data="+attr+"]").val(changed[attr]);
			}
		}
		if(this.model.hasChanged("template")){
			this.$el.find(".field img").attr("src","img/themes/"+this.model.get("template").toLowerCase()+".png");
		}
	},
	viewParticipants : function(){
		modal.show({
			title : "Hola",
			html  : "<b>Funciona participantes</b>"
		});
	},
	viewEnumerations : function(){
		new EnumerationsView({
			collection : app.collections.enumerations
		});
	}
});