var Backbone 	= require('backbone'),
	$			= require('jquery'),
	plugins		= require('../../app/plugins');

module.exports = Backbone.View.extend({
	initialize : function(options){
		this.svg = options.svg;
		this.listenTo(this.model, 'change:name', this.updateName, this);
		this.listenTo(this.model, 'change:x', this.updatePosition, this);
		this.listenTo(this.model, 'change:y', this.updatePosition, this);
	},
	updateName : function(){
		this.label.attr({text : this.model.get('name')});
		this.label.transform(['T',(this.group.getBBox().w / 2) - (this.label.getBBox().w / 2),',',this.group.getBBox().h + 15].join(''));
	},
	updatePosition : function(){
		this.class.transform(['T',this.model.get('x'),',',this.model.get('y')].join(''));
	},
	render : function(){
		var svg = this.svg;
		
		this.label = svg.text(5, 15, this.model.get('name'));
		this.label.attr({
			'font-size' : '12px'
		});

		this.rect1 = svg.rect(0,0,this.label.getBBox().w + 30,this.label.getBBox().h + 20);
		this.rect2 = svg.rect(0,20,this.label.getBBox().w + 30,40);
		this.rects = svg.group(this.rect1,this.rect2);
		this.rects.attr({
			stroke 		: 'black',
			strokeWidth : 2,
			fill 		: '#AEC6CF'
		});
		this.addAttribute = svg.image('/img/diagrams/add_attribute.png',0,-20,20,20);
		this.addAttribute.attr({display : 'none'});
		this.class = svg.group(this.addAttribute,this.rects,this.label);

		var svgWidth = $("#container").width() - 30;
		var svgHeight = $("#container").height() - 65;
		var x = this.model.get('x') || Math.random() * svgWidth + 20;
		var y = this.model.get('y') || Math.random() * svgHeight;
		this.class.transform(['T',x,',',y].join(''));

		this.model.set({x : x, y : y}).save();

		this.addEvents();
		return this;
	},
	addEvents : function(){
		var that = this;
		this.class.drag(this.moveDrag, this.startDrag, this.endDrag, this, this, this);
		this.class.hover(this.hoverIn,this.hoverOut,this,this);
		this.$class = $(this.class.node);
	},
	moveDrag : function(dx, dy, x, y, event){
		this.nx = this.ox + dx;
		this.ny = this.oy + dy;
		this.class.transform(['T',this.nx,',',this.ny].join(''));
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
	hoverIn : function(){
		this.addAttribute.attr({display : 'block'});
	},
	hoverOut : function(){
		this.addAttribute.attr({display : 'none'});
	}
});