var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	plugins			= require('../app/plugins'),
	actorSVG		= require('./svg/actor'),
	useCaseSVG		= require('./svg/useCase'),
	associationSVG 	= require('./svg/useCaseAssociation');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'useCase-view',
	template:require('../templates/useCase.hbs'),
	attachedViews : [],
	initialize : function(){
		this.listenTo(app.collections.useCaseAssociations, 'add', this.addAssociation, this);
		this.listenTo(app.collections.useCaseAssociations, 'remove', this.removeAssociation, this);
		this.listenTo(app.collections.actors, 'add', this.addActor, this);
		this.listenTo(app.collections.functionalRequirements, 'add', this.addUseCase, this);
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
		app.collections.useCaseAssociations.forEach(function(useCaseAssociation){
			that.addAssociation.apply(that, [useCaseAssociation]);
		});
		app.collections.actors.forEach(function(actor){
			that.addActor.apply(that, [actor]);
		});
		app.collections.functionalRequirements.forEach(function(useCase){
			that.addUseCase.apply(that, [useCase]);
		});
		this.addEvents();
	},
	addAssociation : function(useCaseAssociation){
		var associationView = new associationSVG({
			svg 	: this.svg,
			model 	: useCaseAssociation
		}).render();
		this.attachedViews.push(associationView);
	},
	removeAssociation : function(useCaseAssociation){
		this.attachedViews.forEach(function(view){
			if(view.model.id === useCaseAssociation.id){
				view.destroyModel(useCaseAssociation);
			}
		});
	},
	addActor : function(actor){
		var actorView = new actorSVG({
			svg 	: this.svg,
			model 	: actor
		}).render();
		this.attachedViews.push(actorView);
	},
	addUseCase : function(useCase){
		var useCaseView = new useCaseSVG({
			svg 	: this.svg,
			model : useCase
		}).render();
		this.attachedViews.push(useCaseView);
	},
	removeViews : function(){
		this.attachedViews.forEach(function(view, i){
			view.remove();
		});
		this.remove();
	},
	addEvents : function(){
		this.svg.mousemove(function(event){
			if(app.selectingActor || app.selectingUseCase){
				app.useCaseAssociation.attr({
					x2 : event.layerX, 
					y2 : event.layerY
				});
			}
		});
	}
});