var Backbone	 =	require('backbone'),
	$			 =	require('jquery'),
	app			 = 	require('../app/namespace');

module.exports=Backbone.View.extend({
	tagName : 'li',
	initialize : function(options) {
		var that = this;
		this.extra = options.extra;
		this.listenToOnce(this.model,'change:_id',function(){
			that.$el.find('a').attr('href','#view/'+that.extra.type+'/'+that.model.id);
		});
	},
	render : function(){
		var that = this;
		this.$el.html($.el.a({
			href : '#view/'+that.extra.type+'/'+that.model.id,
			data : 'name'
		},that.model.get('name')));	
		app.utils.dataBinding(this);
		return this;
	}
});