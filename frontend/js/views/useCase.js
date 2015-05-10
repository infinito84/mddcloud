var Backbone	= require('backbone'),
	$			= require('jquery'),
	app			= require('../app/namespace'),
	plugins		= require('../app/plugins'),
	actorSVG		= require('./svg/actor');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'useCase-view',
	template:require('../templates/useCase.hbs'),
	attachedViews : [],
	initialize : function(){
		this.listenTo(app.collections.actors, 'add', this.addActor, this);
	},
	render : function(){
		$('.menu li').removeClass('active');
		$('[href="#useCase"]').parent().addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg : function() {
		this.svg = plugins.Snap("svg");
		var that = this;
		app.collections.actors.forEach(function(actor){
			that.addActor.apply(that, [actor]);
		});
	},
	addActor : function(actor){
		var actorView = new actorSVG({
			svg 	: this.svg,
			model : actor
		}).render();
		this.attachedViews.push(actorView);
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view, i){
			view.remove();
		});
		this.remove();
	}
});