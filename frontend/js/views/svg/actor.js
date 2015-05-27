var Backbone 			= require('backbone'),
	$ 					= require('jquery'),
	plugins 			= require('../../app/plugins'),
	app 				= require('../../app/namespace'),
	UseCaseAssociation 	= require('../../models/useCaseAssociation'),
	ActorEditView		= require('../actorEdit');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.listenTo(this.model, 'change:name', this.updateName, this);
		this.listenTo(this.model, 'change:x', this.updatePosition, this);
		this.listenTo(this.model, 'change:y', this.updatePosition, this);
	},
	updateName : function(){
		this.label.attr({text : this.model.get('name')});
	},
	updatePosition : function(){
		this.nx = this.model.get('x');
		this.ny = this.model.get('y');
		this.actor.transform(['T', this.nx, ',', this.ny].join(''));
		this.notifyAssociations();
	},
	render : function(){
		var svg = this.svg;
		this.group = svg.group(
			svg.circle(10,10,10),
			svg.line(10,20,10,40),
			svg.line(0,30,20,30),
			svg.line(10,40,0,50),
			svg.line(10,40,20,50)
		);
		this.label = svg.text(10, 65, this.model.get('name'));
		this.linkUseCase = svg.image('/img/diagrams/add_link_use_case.png',-10,-25,20,20);
		this.edit = svg.image('/img/diagrams/edit.png',10,-25,20,20);

		this.actor = svg.group(
			svg.rect(-10,-5,40,5),
			svg.rect(-5,-5,30,65), //for drag event
			this.linkUseCase,
			this.edit,
			this.group, 
			this.label
		).addClass('actor-svg');		
		
		var svgWidth = $("#container").width() - 30;
		var svgHeight = $("#container").height() - 65;
		var x = this.model.get('x') || Math.random() * svgWidth + 20;
		var y = this.model.get('y') || Math.random() * svgHeight;
		this.actor.transform(['T',x,',',y].join(''));

		this.addEvents();

		this.model.set({x : x, y : y}).save();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.actor.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);
		
		this.actor.click(function(){
			if(app.selectingActor){
				app.selectingActor = false;
				var association = app.collections.useCaseAssociations.findWhere({
					useCase : app.selectedUseCase.id,
					actor 	: that.model.id
				});
				if(association){
					$.notify(app.utils.t('This use case already has assigned this actor'),'error');
				}
				else{
					var useCaseAssociation = new UseCaseAssociation({
						useCase : app.selectedUseCase.id,
						actor 	: that.model.id
					});
					useCaseAssociation.save();
					app.collections.useCaseAssociations.add(useCaseAssociation);
					delete app.selectedUseCase;
				}
				app.useCaseAssociation.remove();
				delete app.useCaseAssociation;
				$('.useCase-view').removeClass('select-actor');
			}
		});

		this.edit.click(function(){
			new ActorEditView({
				model : that.model
			});
		});
		
		this.linkUseCase.click(function(){
			$('.useCase-view').addClass("select-use-case");
			var x = that.model.get('x');
			var y = that.model.get('y');
			app.useCaseAssociation = that.svg.line(x,y,x,y).attr({
				stroke 		: 'green',
				strokeWidth : 2
			}).prependTo(that.svg);
			app.selectingUseCase = true;
			app.selectedActor = that.model;
		});
	},
	moveDrag : function(dx, dy, x, y, event){
		this.moved = true;
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.actor.transform(['T',this.nx,',',this.ny].join(''));
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
			actor : this.model.id
		}).forEach(function(association){
			association.set({
				x1 : that.nx,
				y1 : that.ny
			});
		});
	}
});