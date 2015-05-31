var Backbone		= require('backbone'),
	$				= require('jquery'),
	app				= require('../app/namespace'),
	plugins			= require('../app/plugins');

module.exports = Backbone.View.extend({
	tagName 	: 'div',
	className 	: 'activityDiagram-view',
	template:require('../templates/activityDiagram.hbs'),
	attachedViews : [],
	initialize : function(){
		this.x1 = 400;
		this.y1 = 200;
		this.x = 300;
		this.y = 400;
		this.width = 200;
		this.height = 40;
	},
	render : function(){
		$('.menu li').removeClass('active');
		$('#dropdown-diagramActivities').addClass('active');
		var html=this.template({});
		this.$el.html(html);
		return this;
	},	
	svg : function() {
		this.svg = plugins.Snap("svg");
		var that = this;
	
		window.line = this.line = this.svg.group(
			this.svg.line(this.x1,this.y1,400,400).attr({
				stroke 		: 'red',
				strokeWidth : 2
			}),
			this.svg.line(400,400,390,380).attr({
				stroke 		: 'red',
				strokeWidth : 2
			}),
			this.svg.line(400,400,410,380).attr({
				stroke 		: 'red',
				strokeWidth : 2
			})
		)

		this.svg.circle(this.x1,this.y1,10).attr({
			fill : 'black'
		});

		this.rect = this.svg.rect(0,0,this.width,this.height).attr({
			rx 			: 20,
			stroke 		: 'black',
			strokeWidth : 1,
			fill 		: '#8EA8FF'
		});
		this.rect.transform(['T',this.x,',',this.y].join(''));
		this.rect.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);

		

		this.addEvents();
	},
	addEvents : function(){

	},
	moveDrag : function(dx, dy, x, y, event){
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.rect.transform(['T',this.nx,',',this.ny].join(''));
		this.moved = true;
		if(this.nx < this.x1 && this.x1 < this.nx + this.width){
			if(this.ny < this.y1){
				this.rx = this.nx + this.width/2;
				this.ry = this.ny + this.height;
			}
			else{
				this.rx = this.nx + this.width/2;
				this.ry = this.ny;
			}
		}
		else if(this.ny < this.y1 && this.y1 < this.ny + this.height){
			if(this.nx < this.x1){
				this.rx = this.nx + this.width;
				this.ry = this.ny + this.height/2;
			}
			else{
				this.rx = this.nx;
				this.ry = this.ny + this.height/2;
			}
		}
		else if(this.ny < this.y1 && this.nx < this.x1){
			this.rx = this.nx + this.width - 5;
			this.ry = this.ny + this.height - 5;
		}
		else if(this.ny < this.y1 && this.nx > this.x1){
			this.rx = this.nx  + 5;
			this.ry = this.ny + this.height - 5;
		}
		else if(this.ny > this.y1 && this.nx < this.x1){
			this.rx = this.nx + this.width - 5;
			this.ry = this.ny + 5;
		}
		else if(this.ny > this.y1 && this.nx > this.x1){
			this.rx = this.nx + 5;
			this.ry = this.ny + 5; 
		}
		var distance = Math.sqrt(Math.pow(this.x1 - this.rx,2) + Math.pow(this.y1 - this.ry,2));
		var lines = this.line.selectAll('line');
		lines[0].attr({
			y2 : this.y1 + distance
		});
		lines[1].attr({
			y1 : this.y1 + distance,
			y2 : this.y1 + distance - 20,
		});
		lines[2].attr({
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
	},
	startDrag : function(x, y, event){
		this.ox = this.x;
		this.oy = this.y;
		this.moved = false;
	},
	endDrag : function(event){
		if(this.moved){
			this.x = this.nx;
			this.y = this.ny;
		}
	},
});