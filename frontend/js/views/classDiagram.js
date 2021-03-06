var Backbone			= require('backbone'),
	$					= require('jquery'),
	app					= require('../app/namespace'),
	plugins				= require('../app/plugins'),
	classSVG			= require('./svg/class'),
	EnumerationsView 	= require('./enumerations')
	enumerationSVG 		= require('./svg/enumeration'),
	associationSVG 		= require('./svg/classAssociation');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'classDiagram-view',
	template:require('../templates/classDiagram.hbs'),
	attachedViews : [],
	events : { 
		'click #view-enumerations' : 'viewEnumerations'
	},
	initialize : function(){
		this.listenTo(app.collections.classAssociations, 'add', this.addAssociation, this);
		this.listenTo(app.collections.classAssociations, 'remove', this.removeView, this);
		this.listenTo(app.collections.storageRequirements, 'add', this.addClass, this);
		this.listenTo(app.collections.enumerations, 'add', this.addEnumeration, this);
		this.listenTo(app.collections.enumerations, 'remove', this.removeView, this);
	},
	render : function(){
		$('.menu li').removeClass('active');
		$('[href="#classDiagram"]').parent().addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg : function() {
		var that = this;

		this.svg = plugins.Snap("svg");
		
		app.collections.classAssociations.forEach(function(classAssociation){
			that.addAssociation.apply(that, [classAssociation]);
		});
		app.collections.storageRequirements.forEach(function(storageRequirement){
			that.addClass.apply(that, [storageRequirement]);
		});
		app.collections.enumerations.forEach(function(enumeration){
			that.addEnumeration.apply(that, [enumeration]);
		});

		this.addEvents();
	},
	addAssociation : function(classAssociation){
		var associationView = new associationSVG({
			svg 	: this.svg,
			model 	: classAssociation
		}).render();
		this.attachedViews.push(associationView);
	},
	removeView : function(model){
		this.attachedViews.forEach(function(view){
			if(view.model.id === model.id){
				view.destroyModel(model);
			}
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
	},
	viewEnumerations : function(){
		new EnumerationsView({
			collection : app.collections.enumerations
		});
	},
	addEvents : function(){
		var that = this;
		this.svg.mousemove(function(event){
			if(app.selectingClass){
				var x = app.selectedClass.get('x');
				var y = app.selectedClass.get('y');
				var w = app.selectedSize.w;
				var h = app.selectedSize.h;
				var x2 = event.layerX;
				var y2 = event.layerY;
				if(x < x2 && x2 < x + w){
					app.classAssociation.attr({
						x1 : x2,
						x2 : x2, 
						y1 : y,
						y2 : y2
					});
				}
				else if(y < y2 && y2 < y + h){
					app.classAssociation.attr({
						x1 : x,
						x2 : x2, 
						y1 : y2,
						y2 : y2
					});
				}
				else{
					if(!app.classAssociation2){
						app.classAssociation2 = that.svg.line().attr({
							stroke : 'green',
							strokeWidth : 2
						}).prependTo(that.svg)
					}
					if(y2 < y){
						app.classAssociation.attr({
							x1 : x + w/2,
							x2 : x + w/2, 
							y1 : y,
							y2 : y2
						});						
						app.classAssociation2.attr({
							x1 : x + w/2,
							x2 : x2, 
							y1 : y2,
							y2 : y2				
						});
					}
					else{
						app.classAssociation.attr({
							x1 : x,
							x2 : x2, 
							y1 : y + h/2,
							y2 : y + h/2
						});						
						app.classAssociation2.attr({
							x1 : x2,
							x2 : x2, 
							y1 : y + h/2,
							y2 : y2				
						});
					}
					return;
				}
				if(app.classAssociation2){
					app.classAssociation2.remove();
					delete app.classAssociation2;
				}
			}
		});

		document.onkeydown = function (e) {
			switch(e.keyCode) {
				case 37: // left
					that.svg0.panTo('-10');
					break;
				case 38: // up
					that.svg0.panTo('+0', '-10');
					break;
				case 39: // right
					that.svg0.panTo('+10');
					break;
				case 40: // down
					that.svg0.panTo('+0', '+10');
					break;
			}
		}
	}
});