var Backbone	= require('backbone'),
	$			= require('jquery'),
	app			= require('../app/namespace'),
	plugins		= require('../app/plugins'),
	classSVG	= require('./svg/class');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'classDiagram-view',
	template:require('../templates/classDiagram.hbs'),
	attachedViews : [],
	initialize : function(){
		
	},
	render : function(){
		$('.menu li').removeClass('active');
		$('[href="#classDiagram"]').parent().addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg : function() {
		this.svg = plugins.Snap("svg");
		var that = this;
		app.collections.storageRequirements.forEach(function(storageRequirement){
			that.addClass.apply(that, [storageRequirement]);
		});
	},
	addClass : function(storageRequirement){
		var classView = new classSVG({
			svg 	: this.svg,
			model 	: storageRequirement
		}).render();
		this.attachedViews.push(classView);
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view, i){
			view.remove();
		});
		this.remove();
	}
});