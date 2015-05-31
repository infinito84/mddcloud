var Backbone 						= require('backbone'),
	$								= require('jquery'),
	app 							= require('../../app/namespace'),
	plugins							= require('../../app/plugins'),
	UseCaseAssociation 				= require('../../models/useCaseAssociation'),
	FunctionalRequirementEditView 	= require('../functionalRequirementEdit');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.listenTo(this.model, 'change:name', this.updateName, this);
		this.listenTo(this.model, 'change:x', this.updatePosition, this);
		this.listenTo(this.model, 'change:y', this.updatePosition, this);
	},
	updateName : function(){
		var strings = app.utils.helperAdjustTextSVG(this.model.get('name'));
		this.label.attr({
			text : strings,
			y : (strings.length * 6 * -1) + 12
		});
		this.label.selectAll("tspan").forEach(function(element, index){
			element.attr({x:0, dy:index===0? 0: 12});
		});
	},
	updatePosition : function(){
		this.nx = this.model.get('x');
		this.ny = this.model.get('y');
		this.useCase.transform(['T', this.nx, ',', this.ny].join(''));
		this.notifyAssociations();
	},
	render : function(){
		var svg = this.svg;
		this.ellipse = svg.ellipse(0, 0, 100, 40);
		this.label = this.svg.text(0, 0, '');
		this.updateName();
		this.linkActor = svg.image('/img/diagrams/add_link_actor.png',-22,-65,20,20);
		this.edit = svg.image('/img/diagrams/edit.png', 2,-65,20,20);
		this.useCase = svg.group(
			svg.rect(-25,-70,50,70).addClass('transparent'), 
			this.linkActor,
			this.edit,
			this.ellipse, 
			this.label
		);
		this.useCase.addClass('use-case-svg');
		
		var svgWidth = $("#container").width() - 30;
		var svgHeight = $("#container").height() - 100;
		var x = this.model.get('x') || Math.random() * svgWidth + 20;
		var y = this.model.get('y') || (Math.random() * svgHeight + 50);
		this.useCase.transform(['T',x,',',y].join(''));

		this.addEvents();

		this.model.set({x : x, y : y}).save();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.useCase.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);
		
		this.useCase.click(function(){
			if(app.selectingUseCase){
				app.selectingUseCase = false;
				var association = app.collections.useCaseAssociations.findWhere({
					useCase : that.model.id,
					actor 	: app.selectedActor.id
				});
				if(association){
					$.notify(app.utils.t('This actor already can do this functionality'),'error');
				}
				else{
					var useCaseAssociation = new UseCaseAssociation({
						useCase : that.model.id,
						actor 	: app.selectedActor.id
					});
					useCaseAssociation.save();
					app.collections.useCaseAssociations.add(useCaseAssociation);
					delete app.selectedActor;
				}
				$('.useCase-view').removeClass('select-use-case');
				app.useCaseAssociation.remove();
				delete app.useCaseAssociation;
			}
		});

		this.linkActor.click(function(){
			$('.useCase-view').addClass("select-actor");
			var x = that.model.get('x');
			var y = that.model.get('y');
			app.useCaseAssociation = that.svg.line(x,y,x,y).attr({
				stroke 		: 'green',
				strokeWidth : 2
			}).prependTo(that.svg);
			app.selectingActor = true;
			app.selectedUseCase = that.model;
		});

		this.edit.click(function(){
			new FunctionalRequirementEditView({
				model : that.model
			});
		});
	},
	moveDrag : function(dx, dy, x, y, event){		
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.useCase.transform(['T',this.nx,',',this.ny].join(''));
		this.moved = true;
		this.notifyAssociations();
	},
	startDrag : function(x, y, event){
		this.ox = this.model.get('x');
		this.oy = this.model.get('y');
		this.moved = false;
	},
	endDrag : function(event){
		if(this.moved){
			this.model.set({x : this.nx, y : this.ny}).save();
		}
	},
	notifyAssociations : function(){
		var that = this;
		app.collections.useCaseAssociations.where({
			useCase : this.model.id
		}).forEach(function(association){
			association.set({
				x2 : that.nx,
				y2 : that.ny
			});
		});
	}
});