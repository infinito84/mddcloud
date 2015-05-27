var Backbone		= require("backbone"),
	$				= require("jquery"),
	app				= require("../app/namespace"),
	DropDownItem 	= require("./dropDownItem");

module.exports=  Backbone.View.extend({
	SubView : DropDownItem,	
	initialize : function(options) {
		this.$el = options.$el;
		this.extra = options.extra;
		app.utils.listeningCollection(this);
	},
	customAdd : function($collection,model){
		var that = this;
		$collection.find('[href="#create/'+that.extra.type+'"]').parent().remove();
		$collection.append(model.render().el);
		$collection.append($.el.li(
			$.el.a({
				href  : '#create/'+that.extra.type,
				class : 'add'
			},$.el.i({
				class : 'fa fa-plus'
			}),' ',app.utils.t('create'))
		));
	}
});