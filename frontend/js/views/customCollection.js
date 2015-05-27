var Backbone				= require("backbone"),
	$						= require("jquery"),
	app						= require("../app/namespace"),
	CustomCollectionItem 	= require("./customCollectionItem");

module.exports = Backbone.View.extend({
	SubView : CustomCollectionItem,	
	initialize : function(options) {
		this.$el = options.$el;
		this.extra = options.extra;
		app.utils.listeningCollection(this);
	},
	customAdd : function($collection,subview){
		this.$el.append(subview.render().el);
	}
});