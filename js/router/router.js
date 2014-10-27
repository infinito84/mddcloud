var Backbone	=	require("backbone");

module.exports=Backbone.Router.extend({
	routes:{
		"change/:color":"change_color"
	},
	change_color:function(color){
		//var fill="#"+(parseInt(Math.random()*89)+10)+(parseInt(Math.random()*89)+10)+(parseInt(Math.random()*89)+10);
		mdd.project.set("theme",color);
	}
});