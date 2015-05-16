var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	plugins			= require('../app/plugins'),
	classSVG		= require('./svg/class'),
	enumerationSVG 	= require('./svg/enumeration');

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
		app.collections.enumerations.forEach(function(enumeration){
			that.addEnumeration.apply(that, [enumeration]);
		});
	},
	addClass : function(storageRequirement){
		var classView = new classSVG({
			svg 	: this.svg,
			model 	: storageRequirement
		}).render();
		this.attachedViews.push(classView);
	},
	addEnumeration : function(enumeration){
		var enumerationView = new enumerationSVG({
			svg 	: this.svg,
			model 	: enumeration
		}).render();
		this.attachedViews.push(enumerationView);
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view, i){
			view.remove();
		});
		this.remove();
	}
});