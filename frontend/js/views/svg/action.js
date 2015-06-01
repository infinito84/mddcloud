var Backbone 			= require('backbone'),
	$ 					= require('jquery'),
	plugins 			= require('../../app/plugins'),
	app 				= require('../../app/namespace');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.labels = {
			CREATE : app.utils.t('Create new data from:'),
			READ   : {
				GENERAL  : 'Read all data from:',
				SPECIFIC : 'Read specific data from:',
				SESSION  : 'Read specific data in session from:'
			},
			UPDATE : app.utils.t('Update specific data from:'),
			DELETE : app.utils.t('Delete specific data from:')
		};
		this.listenTo(this.model, 'change:x', this.updatePosition, this);
		this.listenTo(this.model, 'change:y', this.updatePosition, this);
		this.listenTo(this.model, 'change:nx', this.notifyAssociations, this);
		this.listenTo(this.model, 'change:ny', this.notifyAssociations, this);
		var parentAction = app.collections.actions.get(this.model.get('parentAction'));
		if(parentAction){
			this.listenTo(parentAction, 'change:nx', this.notifyAssociations, this);
			this.listenTo(parentAction, 'change:ny', this.notifyAssociations, this);
		}
	},
	updatePosition : function(){
		this.nx = this.model.get('x');
		this.ny = this.model.get('y');
		this.action.transform(['T', this.nx, ',', this.ny].join(''));
		this.notifyAssociations();
	},
	render : function(){
		var svg = this.svg;
		var model = this.model.toJSON();
		if(model.operation === 'START'){
			this.action = svg.group(
				svg.circle(10,10,10),
				svg.rect(-5,-5,30,30).addClass('selector')
			);
		}
		if(['CREATE','READ','UPDATE','DELETE'].indexOf(model.operation) !== -1){
			var storage = app.collections.storageRequirements.get(model.storageRequirement);
			if(model.operation === 'READ'){
				this.label = this.labels.READ[model.readMethod];
			}
			else{
				this.label = this.labels[model.operation];
			}
			this.action = svg.group(
				this.svg.rect(0,0,200,40).addClass('action'),
				this.svg.text(100,10,[this.label,storage.get('name')]),
				svg.rect(-5,-5,210,50).addClass('selector')
			);
			this.action.selectAll("tspan").forEach(function(element, index){
				element.attr({x:100, dy:index===0? 7: 14});
			});
		}
		this.updatePosition();
		this.action.addClass(model.operation).addClass('action'+model._id);
		this.addEvents();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.action.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);
		
		this.action.click(function(event){
			event.stopPropagation();
			if(that.moved){
				delete that.moved;
				return;
			}
			that.svg.selectAll('.selected').forEach(function(svgElement){
				svgElement.removeClass('selected');
			});
			that.action.addClass('selected');
			app.selectedAction = that.model;
		});
	},
	moveDrag : function(dx, dy, x, y, event){
		this.moved = true;
		app.movedAction = true;
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.model.set({nx : this.nx, ny : this.ny}).save();
		this.action.transform(['T',this.nx,',',this.ny].join(''));
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
		var parentAction = app.collections.actions.get(this.model.get('parentAction'));
		if(!parentAction){
			return;
		}		
		this.x1 = parentAction.get('nx') + parentAction.get('width')/2;
		this.y1 = parentAction.get('ny') + parentAction.get('height')/2;
		this.width2 = parentAction.get('width')/2;
		this.height2 = parentAction.get('height')/2;
		this.nx = this.model.get('nx') || this.model.get('x');
		this.ny = this.model.get('ny') || this.model.get('y');
		this.width = 200;
		this.height = 40;
		if(!this.line){
			this.line = this.svg.group(
				this.svg.line(0,0,0,0),
				this.svg.line(0,0,0,0),
				this.svg.line(0,0,0,0)
			).prependTo(this.svg);
		}
		if(this.nx < this.x1 && this.x1 < this.nx + this.width){
			if(this.ny < this.y1){
				this.rx = this.nx + this.width/2;
				this.ry = this.ny + this.height;
				this.y1 = this.y1 - this.height2;
			}
			else{
				this.rx = this.nx + this.width/2;
				this.ry = this.ny;
				this.y1 = this.y1 + this.height2;
			}
		}
		else if(this.ny < this.y1 && this.y1 < this.ny + this.height){
			if(this.nx < this.x1){
				this.rx = this.nx + this.width;
				this.ry = this.ny + this.height/2;
				this.x1 = this.x1 - this.width2;
			}
			else{
				this.rx = this.nx;
				this.ry = this.ny + this.height/2;
				this.x1 = this.x1 + this.width2;
			}
		}
		else if(this.ny < this.y1 && this.nx < this.x1){
			this.rx = this.nx + this.width - 5;
			this.ry = this.ny + this.height - 5;
			this.x1 = this.x1 - this.width2 + 5;
			this.y1 = this.y1 - this.height2 + 5;
		}
		else if(this.ny < this.y1 && this.nx > this.x1){
			this.rx = this.nx  + 5;
			this.ry = this.ny + this.height - 5;
			this.x1 = this.x1 + this.width2 - 5;
			this.y1 = this.y1 - this.height2 + 5;
		}
		else if(this.ny > this.y1 && this.nx < this.x1){
			this.rx = this.nx + this.width - 5;
			this.ry = this.ny + 5;
			this.x1 = this.x1 - this.width2 + 5;
			this.y1 = this.y1 + this.height2 - 5;
		}
		else if(this.ny > this.y1 && this.nx > this.x1){
			this.rx = this.nx + 5;
			this.ry = this.ny + 5; 
			this.x1 = this.x1 + this.width2 - 5;
			this.y1 = this.y1 + this.height2 - 5;
		}
		var distance = Math.sqrt(Math.pow(this.x1 - this.rx,2) + Math.pow(this.y1 - this.ry,2));
		var lines = this.line.selectAll('line');
		lines[0].attr({
			x1 : this.x1,
			x2 : this.x1,
			y1 : this.y1,
			y2 : this.y1 + distance
		});
		lines[1].attr({
			x1 : this.x1,
			x2 : this.x1 + 10,
			y1 : this.y1 + distance,
			y2 : this.y1 + distance - 20,
		});
		lines[2].attr({
			x1 : this.x1,
			x2 : this.x1 - 10,
			y1 : this.y1 + distance,
			y2 : this.y1 + distance - 20,
		});
		var angle = Math.atan((this.ry - this.y1)/(this.rx - this.x1)) || 0;
		angle = angle * (180/Math.PI);
		if(this.x1 === this.rx){
			angle = 0;
			if(this.y1 > this.ry){
				angle = 180;
			}
		}
		else if(this.x1 < this.rx){
			angle += -90;
		}
		else{
			angle += 90;
		}
		this.line.transform('r'+angle+','+this.x1+','+this.y1);
	}
});