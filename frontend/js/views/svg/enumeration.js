var Backbone 	= require('backbone'),
	$			= require('jquery'),
	plugins		= require('../../app/plugins'),
	app			= require('../../app/namespace');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.listenTo(this.model, 'change', this.updateName, this);
	},
	updateName : function(){
		this.enumeration.remove();
		this.render();
	},
	updatePosition : function(){
		this.enumeration.transform(['T',this.model.get('x'),',',this.model.get('y')].join(''));
	},
	render : function(){
		var that = this;
		var svg = this.svg;
		var values = this.model.get('values') || [];

		this.enumeration = svg.group();
		this.enumeration.addClass('enumeration-svg');

		var label = svg.text(5, 17, app.utils.fixName(this.model.get('name'), true))
					.addClass('main');
					
		this.enumeration.add(label);

		var ytemp = label.getBBox().w;
		var ltemp = label;
		
		var y = 20;

		values.forEach(function(value){
			label = svg.text(5, y + 17, value);
			that.enumeration.add(label);
			y += 22;
		});
		max = this.enumeration.getBBox().w;
		ltemp.attr({x : (max-ytemp)/2 + 5});

		this.enumeration.prepend(svg.rect(0,0, max + 10, 22));
		
		y = 20;
		if(values.length){
			values.forEach(function(){
				that.enumeration.prepend(svg.rect(0,y, max + 10, 22));
				y += 22;
			});
		}
		else{
			this.enumeration.prepend(svg.rect(0,y, max + 10, 40));
			y += 22;
		}

		var svgWidth = $('#container').width() - max;
		var svgHeight = $('#container').height() - y;
		var x = this.model.get('x') || Math.random() * svgWidth + 20;
		var y = this.model.get('y') || Math.random() * svgHeight;
		this.model.set({x : x, y : y}).save();

		this.enumeration.transform(['T',x,',',y].join(''));

		this.addEvents();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.enumeration.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);
		this.enumeration.hover(this.hoverIn,this.hoverOut,this,this);
		this.$class = $(this.enumeration.node);
	},
	moveDrag : function(dx, dy, x, y, event){
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.enumeration.transform(['T',this.nx,',',this.ny].join(''));
	},
	startDrag : function(x, y, event){
		this.ox = this.model.get('x');
		this.oy = this.model.get('y');
	},
	endDrag : function(event){
		this.model.set({
			x : this.nx,
			y : this.ny
		}).save();
	},
	destroyModel : function(){
		this.enumeration.remove();
		this.remove();
	}
});